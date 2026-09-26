const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.join(__dirname,'..');
class Element {
  constructor(tag='div') {
    this.tag=tag; this.children=[]; this.dataset={}; this.style={setProperty(){}}; this.hidden=false;
    this.textContent=''; this.disabled=false; this.attributes={}; this._html='';
    const classes=new Set();
    this.classList={add:x=>classes.add(x),remove:x=>classes.delete(x),contains:x=>classes.has(x),toggle:(x,on)=>on?classes.add(x):classes.delete(x)};
  }
  set innerHTML(v){this._html=v;this.children=[];} get innerHTML(){return this._html;}
  appendChild(el){this.children=this.children.filter(child=>child!==el);this.children.push(el);} querySelectorAll(){return this.children.filter(x=>x.tag==='button');}
  setAttribute(k,v){this.attributes[k]=v;} getAttribute(k){return this.attributes[k];}
  addEventListener(){} removeEventListener(){} remove(){} closest(){return null;}
}
const elements=new Map();
const el=id=>{if(!elements.has(id))elements.set(id,new Element());return elements.get(id);};
const document={querySelector:el,getElementById:id=>el('#'+id),createElement:tag=>new Element(tag),
  addEventListener(){},removeEventListener(){},documentElement:new Element(),body:new Element()};
const storage=new Map();
const context=vm.createContext({document,console:{log(){}},localStorage:{getItem(k){return storage.get(k)||null;},setItem(k,v){storage.set(k,v);}},
  setTimeout(fn){fn();return 1;},clearTimeout(){},innerHeight:800,addEventListener(){},assert,el});
context.window=context;
vm.runInContext(fs.readFileSync(path.join(root,'scene-art.js'),'utf8'),context);
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const script of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) if(!script[1].includes('application/ld+json'))vm.runInContext(script[2],context);
vm.runInContext(fs.readFileSync(path.join(root,'campaign.js'),'utf8'),context);
vm.runInContext(`
appendStory=()=>{}; appendStoryAsync=async()=>{}; showLevelUp=()=>{};
newGame();
assert.equal(el('#streetArt').dataset.asset,'street-ontario');
assert.equal(el('#enemyActor').hidden,true);
for(const street of STREETS){Game.level=Game.currentStreet=street.level;updateSceneArt();assert.ok(el('#streetArt').dataset.asset.startsWith('street-'));}
for(const color of CONFIG.enemyTypes){
  Game.enemy={name:color,color,hp:30,maxHP:30,isBoss:false};Game.scene='combat';updateHealthMeters();
  assert.equal(el('#enemyArt').dataset.asset,'alien-'+color);assert.equal(el('#enemyActor').hidden,false);
  Game.enemy.isBoss=true;updateSceneArt();
  assert.equal(el('#enemyArt').dataset.asset,'boss-'+color);
}
Game.enemy.isBoss=true;updateSceneArt();assert.equal(el('#sceneArt').classList.contains('is-boss'),true);
updateCombatButtons();
el('#buttons').children.find(b=>b.textContent==='Flee').onclick({});
assert.equal(Game.scene,'explore');assert.equal(el('#enemyActor').hidden,true);
Game.currentStreet=1;Game.level=1;Game.requiredThisLevel=3;Game.aliensThisLevel=2;Game.pendingReward=2;Game.enemy={hp:0,isBoss:true};
collectReward();assert.equal(Game.level,2);assert.equal(Game.currentStreet,1);assert.equal(el('#streetArt').dataset.asset,'street-ontario');travelToStreet(2);assert.equal(el('#streetArt').dataset.asset,'street-superior');
Game.currentStreet=9;Game.level=9;Game.requiredThisLevel=4;Game.aliensThisLevel=3;Game.pendingReward=1;Game.enemy={hp:0,isBoss:true};
collectReward();assert.equal(Game.level,10);assert.notEqual(Game.scene,'victory');travelToStreet(10);
Game.aliensThisLevel=2;Game.pendingReward=20;Game.enemy={hp:0,isBoss:true,isFinalBoss:true};
collectReward();assert.equal(Game.scene,'victory');assert.equal(el('#endingArt').dataset.asset,'ending-victory');
assert.equal(el('#streetArt').dataset.asset,'street-erieside');assert.equal(el('#buttons').children.length,0);
assert.equal(el('#overlay').style.display,'flex');
Game.scene='combat';Game.enemy={name:'blue',color:'blue',hp:10,maxHP:10};
gameOver();assert.equal(Game.scene,'gameover');assert.equal(el('#endingArt').dataset.asset,'ending-defeat');assert.equal(el('#enemyActor').hidden,true);
newGame();assert.equal(Game.level,1);assert.equal(el('#overlay').style.display,'none');assert.equal(el('#enemyActor').hidden,true);
assert.equal(el('#combatStats').style.display,'none','Restart clears the combat HUD');
const originalRandom=Math.random;
Math.random=()=>0;
for(const business of businesses){
  Game.currentStreet=DISTRICT_SHOPS.findIndex(ids=>ids.includes(business.id))+1;Game.level=Game.highestDistrict=Game.currentStreet;
  if(business.id==='frank')Game.secretsFound.push('franks-key');
  announceBusiness(business.id);
  assert.equal(el('#streetArt').dataset.asset,SceneArt.streets[getStreet(streetNumber()).id][0],'Approaching retains the street');
  startBusiness(business.id);
  assert.equal(el('#streetArt').dataset.asset,SceneArt.businesses[business.id][0]);
  assert.equal(el('#sceneLocation').children.find(node=>node.tag==='span').textContent,business.name);
  assert.equal(el('#enemyActor').hidden,true);
  Game.money=100;buyBusinessItem(business.id,business.items[0]);
  assert.equal(el('#streetArt').dataset.asset,SceneArt.businesses[business.id][0],'Purchases retain the shop');
  el('#buttons').children.find(b=>b.textContent==='Leave').onclick({});
  assert.equal(Game.businessEntered,false);
  assert.equal(el('#streetArt').dataset.asset,SceneArt.streets[getStreet(streetNumber()).id][0],'Leaving restores the street');
}
newGame();
for(const [start,key,action] of [[startMisc,'tv','Watch'],[startNews,'newspaper','Read'],[startNPC,'survivor-ontario','Talk'],[startPolice,'police','Talk']]){
  start();assert.equal(el('#streetArt').dataset.asset,SceneArt.encounters[key][0]);
  el('#buttons').children.find(b=>b.textContent===action).onclick({});
  assert.equal(el('#streetArt').dataset.asset,SceneArt.encounters[key][0],'Dialogue retains illustration');
  Game.streetDecks[streetNumber()]=['hidden'];encounter();assert.equal(Game.artEncounter,null);
  assert.equal(el('#streetArt').dataset.asset,'street-ontario');
}
for(const roll of [0.2,0.35]){
  startEmpty();Math.random=()=>roll;
  el('#buttons').children.find(b=>b.textContent==='Look Around').onclick({});
  assert.equal(el('#streetArt').dataset.asset,'encounter-care-package');
  assert.ok(el('#buttons').children.some(b=>/^Eat Rations|^Take Kevlar Vest/.test(b.textContent)),'Care package waits for an explicit pickup');
  Game.streetDecks[streetNumber()]=['hidden'];encounter();assert.equal(Game.artEncounter,null);
}
newGame();assert.equal(Game.currentBiz,null);assert.equal(Game.businessEntered,false);assert.equal(Game.artEncounter,null);
onboardingZap();assert.equal(el('#streetArt').dataset.asset,'encounter-onboarding-zap');
Game.onboardingStep='complete';Game.mayorState='controlled';startMisc();assert.equal(el('#streetArt').dataset.asset,'encounter-mayor-controlled');
Game.currentStreet=7;Game.secretsFound=[];offerHidden(HIDDEN_FINDS[7][0]);assert.equal(el('#streetArt').dataset.asset,'encounter-franks-key');
Game.mayorState='saved';showDispatch();assert.equal(el('#streetArt').dataset.asset,'transit-cab-secure');
Math.random=originalRandom;
`,context);
const paths=new Set();
for(const element of elements.values()){
  if(element.src) paths.add(element.src);
  if(element.srcset) for(const src of element.srcset.split(',')) paths.add(src.trim().split(' ')[0]);
}
const assets=fs.readdirSync(path.join(root,'images/art'));
assert.equal(assets.filter(x=>!x.includes('-small')).length,59);
assert.equal(assets.filter(x=>x.includes('-small')).length,51);
const catalog=vm.runInContext('({...SceneArt.streets,...SceneArt.businesses,...SceneArt.encounters})',context);
for(const key of ['bus-zapped','rapid-running','rapid-stalled','cab-scared','cab-secure','cab-singing','onboarding-zap','mayor-controlled','franks-key','survivor-ontario','survivor-superior','survivor-lakeside','survivor-west-6th','survivor-old-river','survivor-prospect','survivor-erieside'])assert.ok(vm.runInContext(`Object.hasOwn(SceneArt.encounters,'${key}')`,context),key);
for(const [asset] of Object.values(catalog)){
  paths.add('images/art/'+asset+'.webp');paths.add('images/art/'+asset+'-small.webp');
}
for(const color of ['blue','green','grey','red'])for(const type of ['alien','boss'])paths.add('images/art/'+type+'-'+color+'.webp');
vm.runInContext("Game.scene='combat';Game.currentStreet=Game.level=10;Game.enemy={name:'MOTHERSHIP COMMANDER',color:'red',hp:147,maxHP:147,isBoss:true,isFinalBoss:true};updateSceneArt();",context);
assert.equal(el('#streetArt').dataset.asset,'shop-captain-franks');assert.equal(el('#enemyArt').dataset.asset,'boss-red');
for(const src of paths)assert.ok(fs.existsSync(path.join(root,src)),src);
console.log('PASS: 10 streets; 4 aliens; 4 bosses; 18 business entry/purchase/exit flows; 21 encounter types; both care-package rewards; state-aware cab/news/onboarding/key art; final restaurant; flee cleanup; level-up; endings; restart; 110 optimized assets.');
module.exports={context,el,storage,vm,assert};

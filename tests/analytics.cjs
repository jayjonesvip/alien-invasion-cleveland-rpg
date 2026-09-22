const fs=require('node:fs');
const path=require('node:path');
const {context,vm,assert}=require('./art-integration.cjs');
const source=fs.readFileSync(path.join(__dirname,'../analytics.js'),'utf8');
// A fake DOM captures the tag without requesting Google or sending test traffic.
function boot(hostname){
  const scripts=[];
  const scope=vm.createContext({location:{hostname},document:{createElement:()=>({}),head:{appendChild:tag=>scripts.push(tag)}}});
  scope.window=scope;vm.runInContext(source,scope);return {scope,scripts};
}
for(const hostname of ['localhost','127.0.0.1','','preview.example.com']){
  const {scope,scripts}=boot(hostname);scope.trackGameEvent('new_game');
  assert.equal(scripts.length,0);assert.equal(scope.dataLayer,undefined);
}
for(const hostname of ['lakeeffectinvasion.com','www.lakeeffectinvasion.com']){
  const {scope,scripts}=boot(hostname);
  assert.equal(scripts.length,1);assert.equal(scripts[0].async,true);
  assert.equal(scripts[0].src,'https://www.googletagmanager.com/gtag/js?id=G-W7H8DZ7F3R');
  assert.equal(scope.dataLayer[1][0],'config');assert.equal(scope.dataLayer[1][1],'G-W7H8DZ7F3R');
}
context.location={hostname:'lakeeffectinvasion.com'};
context.document.head={appendChild(){}};
vm.runInContext(source,context);
vm.runInContext(`(async()=>{
const events=[];window.gtag=(command,name,params)=>events.push({command,name,params});
const count=name=>events.filter(e=>e.name===name).length;
newGame();assert.equal(count('new_game'),1);
saveGame();continueGame();assert.equal(count('new_game'),1);assert.equal(count('game_resume'),1);
startCombat();assert.equal(count('fight_start'),1);assert.equal(count('tutorial_begin'),1);
await playerAttack('tackle');assert.equal(count('tutorial_complete'),1);
saveGame();continueGame();assert.equal(count('tutorial_complete'),1);assert.equal(count('tutorial_begin'),1);
Game.enemy.hp=0;winCombat();winCombat();assert.equal(count('alien_defeated'),1);
saveGame();continueGame();winCombat();assert.equal(count('alien_defeated'),1,'Defeated saved enemy is not counted again');
collectReward();collectReward();assert.equal(count('earn_virtual_currency'),1);
assert.equal(events.find(e=>e.name==='alien_defeated').params.street,1);
Game.aliensThisLevel=2;startCombat();Game.enemy.hp=0;winCombat();collectReward();
assert.equal(count('level_up'),1);assert.equal(events.find(e=>e.name==='level_up').params.level,2);
continueGame();checkLevelUp();assert.equal(count('level_up'),1);
travelToStreet(2);assert.equal(count('street_travel'),1);
Game.hp=0;gameOver();gameOver();saveGame();continueGame();assert.equal(count('player_defeated'),1);
recoverAtShelter();assert.equal(count('shelter_recovery'),1);
newGame();startBusiness('record');const tape=getBusiness('record').items.find(x=>x.id==='throwEnemy');
Game.money=0;buyBusinessItem('record',tape);assert.equal(count('spend_virtual_currency'),0);
Game.money=100;buyBusinessItem('record',tape);buyBusinessItem('record',tape);
assert.equal(count('spend_virtual_currency'),1);assert.equal(count('skill_learned'),1);
assert.equal(events.find(e=>e.name==='spend_virtual_currency').params.virtual_currency_name,'Cleveland cash');
Game.level=Game.currentStreet=Game.highestDistrict=10;Game.aliensThisLevel=2;
startCombat();Game.enemy.hp=0;winCombat();collectReward();saveGame();continueGame();gameVictory();
assert.equal(count('campaign_complete'),1);
assert.equal(count('purchase'),0,'Virtual shopping must not create real revenue');
window.gtag=()=>{throw new Error('Blocked analytics');};newGame();startCombat();
assert.equal(Game.scene,'combat','Transport failures cannot break gameplay');
delete window.trackGameEvent;newGame();assert.equal(Game.level,1,'Missing analytics file cannot break gameplay');
})()`,context).then(()=>console.log('PASS: GA4 tag, production-only loading, event payloads, one-time kills/levels/tutorial/ending, save resume, purchases, blocked analytics.')).catch(e=>{console.error(e);process.exitCode=1;});

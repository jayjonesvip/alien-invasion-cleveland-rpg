/* Campaign progression, city directory, and versioned local checkpoints. */
const SAVE_KEY = 'alienRPGCampaignV1';
const DISTRICT_SHOPS = [
  ['coffee','pawn','record'], ['pizza','thrift','drugstore'], ['diner','arcade'],
  ['rac','camera'], ['chinese','deli'], ['convenience','bar'], ['surplus'], ['church'], ['hotdog'], []
];
const TRAINING = [
  {id:'throwEnemy', name:'Grappling VHS', price:18, skill:'throwEnemy', description:'Learn Throw Enemy: reliable, repeatable damage.'},
  {id:'superKick', name:'Lake Effect Kick VHS', price:24, skill:'superKick', description:'Learn a powerful kick, once per fight.'},
  {id:'superPunch', name:'Ironworks Punch VHS', price:28, skill:'superPunch', description:'Learn a powerful punch, once per fight.'},
  {id:'spinningKick', name:'Spinning Kick VHS', price:32, skill:'spinningKick', description:'Learn a strong, repeatable spinning kick.'},
  {id:'counter', name:'Counterattack VHS', price:20, skill:'counter', description:'Guard returns damage after you block a hit.'},
  ...[1,2,3].map(n=>({id:'conditioning'+n,name:'Conditioning '+n,price:12*n,defense:1,requires:n>1?'conditioning'+(n-1):null,description:'Permanent +1 defense against every hit.'}))
];
const TRAINING_SHOPS = {throwEnemy:'record',counter:'record',conditioning1:'drugstore',superKick:'arcade',conditioning2:'thrift',spinningKick:'pawn',superPunch:'surplus',conditioning3:'church'};
for (const item of TRAINING) getBusiness(TRAINING_SHOPS[item.id]).items.push({...item,healing:0,message:'Training complete.'});
function winsRequiredForStreet(number=Game.level) { return number>=4&&number<=9?4:3; }
function regularWinsRequired(number=Game.level) { return winsRequiredForStreet(number)-1; }
const STREET_LANDMARKS = ['Terminal Tower / Public Square','The abandoned bus blockade','The theater marquees','The bank towers','The civic plaza','The warehouse loading docks','The river lift bridge','The neighborhood sanctuary','The railway viaduct','The Lake Erie harbor'];
const STREET_SIGHTS = [
  ['sign','npc','news','hidden'], ['sign','npc','hidden'], ['sign','news','hidden'], ['sign','hidden'], ['sign','npc','news'],
  ['sign','npc','hidden'], ['sign','hidden'], ['sign','npc','news'], ['sign','hidden'], ['sign','npc','hidden']
];
const ONE_TIME_SIGHTS = new Set(['sign','npc','news']);
const STREET_SIGNS = [
  'A newspaper seller hands you a rain-soaked Plain Dealer. The headline says the mayor is missing and the crisis began at Terminal Tower.',
  'The sideways bus still has a passenger list. One name is circled in ballpoint.',
  'The Palace marquee has been re-lettered by hand: THEY LEARN YOUR GUARD.',
  'A revolving door turns by itself and spits out a safe-deposit tag from the tower bank.',
  'A seagull drops a police radio on the civic steps. It is still switched on.',
  'Steam off a manhole fogs a loading schedule. Tonight\'s dock is already crossed out.',
  'The lift-bridge horn sounds. The tender\'s shack is empty.',
  'One candle is still burning in a sanctuary window above Prospect.',
  'Fresh chalk on the viaduct: RED GETS WORSE IF YOU WAIT.',
  'The harbormaster\'s binoculars are set on a tripod, aimed back at the city.'
];
const STREET_VOICES = [
  'Stay under the Tower lights. They hate the square.',
  'I saw it zap the tire. I am not driving that bus.',
  null,
  null,
  'The plaza is the only open ground. Do not bring anything that shines.',
  'Pop the flare if the bay door bangs twice.',
  null,
  'The side door of the church still opens.',
  null,
  'The commander watches for the second guard to fall.'
];
const STREET_PAPERS = [
  'CLEVELAND PRESS: Troops at Public Square. The Rapid is still running.',
  null,
  'CLEVELAND PRESS: Euclid marquees to go dark. Do not trust a quiet lobby.',
  null,
  'CLEVELAND PRESS: Lakeside plaza held through the night. Bring nothing that shines.',
  null,
  null,
  'CLEVELAND PRESS: St. Stanislaus is housing anyone who saw the boss land.',
  null,
  null
];
CONFIG.abilities.superKick.name='Lake Effect Kick';
CONFIG.abilities.superKick.damageMultiplier=1;
CONFIG.abilities.superPunch.name='Ironworks Punch';
CONFIG.abilities.superPunch.damageMultiplier=1;
CONFIG.abilities.superPunch.minDamage=28;
CONFIG.abilities.superPunch.maxDamage=36;
CONFIG.abilities.throwEnemy.hit=.9;
CONFIG.abilities.spinningKick.hit=.8;
const FOOD_POWER = {coffee:'accuracy',donut:'maxHP',burger:'punch',corned:'punch',jerky:'punch',generaltso:'kick',eggroll:'kick',hottea:'accuracy',milkshake:'maxHP'};
function defaultRoute() { return [1,2,3,4,5,6,7,8,9,10]; }
function buildRoute(start) {
  const body=[];
  for(let number=start;number<=9;number++) body.push(number);
  for(let number=1;number<start;number++) body.push(number);
  body.push(10);
  return body;
}
function activeStreet() { return (Game.route||defaultRoute())[Game.level-1]; }
function routeIndex(street) { return (Game.route||defaultRoute()).indexOf(street); }
function initCampaign() {
  Object.assign(Game,{learned:[],training:[],tasted:[],permanent:{punch:0,kick:0,defense:0,accuracy:0},
    highestDistrict:1,currentStreet:1,route:defaultRoute(),newlyUnlockedStreet:null,secretsFound:[],knownShops:[],streetSeen:{},exploreSeed:Math.floor(Math.random()*1e9)+1,streetDecks:{},deckBuilds:{},finalBossDefeated:false,guarding:false,blockedHit:false,tempWeapon:null,weaponUses:0,tempWeaponUsed:false,
    currentBiz:null,businessEntered:false,artEncounter:null});
}
initCampaign();
function streetNumber() { return Game.currentStreet; }
function streetCleared() { const index=routeIndex(streetNumber()); return index<0 || index<Game.level-1 || Game.finalBossDefeated; }
function availableShopIds() { return DISTRICT_SHOPS[streetNumber()-1] || []; }
function canVisitShop(id) { return availableShopIds().includes(id) && !['combat','victory','gameover'].includes(Game.scene); }
function noteShop(id) { Game.knownShops=Game.knownShops||[]; if(id&&!Game.knownShops.includes(id)) Game.knownShops.push(id); }
function exploreRandom(seed) {
  let value=seed>>>0;
  return ()=>{ value=Math.imul(value^(value>>>15),value|1); value^=value+Math.imul(value^(value>>>7),value|61); return ((value^(value>>>14))>>>0)/4294967296; };
}
function buildStreetDeck(street=streetNumber()) {
  Game.deckBuilds=Game.deckBuilds||{};
  const built=(Game.deckBuilds[street]||0)+1; Game.deckBuilds[street]=built;
  const seen=Game.streetSeen?.[street]||{};
  const cards=[...(STREET_SIGHTS[street-1]||[])].filter(card=>!ONE_TIME_SIGHTS.has(card)||!seen[card]);
  if(!streetCleared()) cards.push('combat');
  for(const id of (DISTRICT_SHOPS[street-1]||[])) if(!(Game.knownShops||[]).includes(id)) cards.push('shop:'+id);
  const random=exploreRandom((Game.exploreSeed||1)^(street*997)^(built*131));
  for(let i=cards.length-1;i>0;i--){ const j=Math.floor(random()*(i+1)); const swap=cards[i]; cards[i]=cards[j]; cards[j]=swap; }
  return cards;
}
function streetSights(street=streetNumber()) {
  return [...(STREET_SIGHTS[street-1]||[]),(DISTRICT_SHOPS[street-1]||[]).map(id=>'shop:'+id)].flat();
}
function streetFullySeen(street=streetNumber()) {
  const seen=Game.streetSeen?.[street]||{};
  return streetSights(street).every(card=>card.startsWith('shop:')?(Game.knownShops||[]).includes(card.slice(5)):!!seen[card]);
}
function holdBossForSights(street) {
  const bossReady=!streetCleared()&&street===activeStreet()&&Game.aliensThisLevel===regularWinsRequired(Game.level);
  if(!bossReady||streetFullySeen(street)) return;
  const deck=Game.streetDecks[street]||[];
  const waiting=deck.filter(card=>card==='combat');
  const rest=deck.filter(card=>card!=='combat');
  const seen=Game.streetSeen?.[street]||{};
  for(const card of streetSights(street)){
    const found=card.startsWith('shop:')?(Game.knownShops||[]).includes(card.slice(5)):!!seen[card];
    if(!found&&!rest.includes(card)) rest.push(card);
  }
  Game.streetDecks[street]=rest.concat(waiting.length?waiting:['combat']);
}
function drawExploreCard() {
  const street=streetNumber();
  Game.streetDecks=Game.streetDecks||{};
  Game.streetSeen=Game.streetSeen||{};
  let deck=Game.streetDecks[street];
  if(!Array.isArray(deck)||!deck.length) deck=Game.streetDecks[street]=buildStreetDeck(street);
  holdBossForSights(street);
  deck=Game.streetDecks[street];
  let card=deck.shift();
  let skipped=0;
  while((card==='combat'&&streetCleared())||(ONE_TIME_SIGHTS.has(card)&&Game.streetSeen[street]?.[card])){
    if(!deck.length) deck=Game.streetDecks[street]=buildStreetDeck(street);
    card=deck.shift();
    if(++skipped>30){card='hidden';break;}
  }
  if(card==='sign'||card==='npc'||card==='hidden'||card==='news'){ Game.streetSeen[street]=Game.streetSeen[street]||{}; Game.streetSeen[street][card]=true; }
  return card;
}
function travelToStreet(destination) {
  const fromIndex=routeIndex(streetNumber()), toIndex=routeIndex(destination);
  if(!Number.isInteger(destination)||toIndex<0||Math.abs(toIndex-fromIndex)!==1||toIndex>Game.level-1) return;
  if(['start','combat','victory','gameover','intro'].includes(Game.scene)||StoryType.holdLock||StoryType.typing) return;
  const from=getStreet(streetNumber());
  window.trackGameEvent?.('street_travel', {from_street:streetNumber(),to_street:destination});
  Game.currentStreet=destination;Game.scene='explore';Game.currentBiz=null;Game.businessEntered=false;Game.artEncounter=null;
  if(Game.newlyUnlockedStreet===destination)Game.newlyUnlockedStreet=null;
  Game.lastEncounters=[];Game.lastBusiness=null;Game.streetJustChanged=false;
  showDirectory('You walk from '+from.name+' to '+getStreet(destination).name+'. '+(toIndex<Game.level-1?getStreet(destination).cleared:getStreet(destination).enter));
}
function streetOfferings(number) {
  const shops=DISTRICT_SHOPS[number-1];
  const training=TRAINING.filter(item=>shops.includes(TRAINING_SHOPS[item.id])).map(item=>item.name);
  return (shops.length?shops.map(id=>getBusiness(id).name).join(', '):'No shops. Prepare on Huron before the final assault.')+(training.length?' / Training: '+training.join(', '):'');
}
function foodBonus(item) { return item.healing>0 && !item.armor && !['lotto','bandages'].includes(item.id) ? (FOOD_POWER[item.id] || 'maxHP') : null; }
function itemOwned(item) { return !!((item.skill||item.defense) && Game.training.includes(item.id)); }
function gearOwned(item) {
  if(itemOwned(item)) return true;
  if(item.armor&&Game.armor&&Game.armor.durabilityHits>0&&Game.armor.name===item.armor.name) return true;
  if(item.tempWeapon&&Game.tempWeapon===item.tempWeapon&&!Game.tempWeaponUsed&&Game.weaponUses>0) return true;
  return false;
}
function itemDescription(bizId,item) {
  if(gearOwned(item)&&(item.skill||item.defense||item.armor||item.tempWeapon)) return 'OWNED · already carrying this';
  if(item.skill||item.defense) return item.description+(item.requires&&!Game.training.includes(item.requires)?' Requires previous conditioning.':'');
  const parts=[];
  if(item.healing>0) parts.push('Restore '+item.healing+' HP');
  if(item.healing<0) parts.push('Lose '+Math.abs(item.healing)+' HP');
  const bonus=foodBonus(item);
  if(bonus&&!Game.tasted.includes(bizId+':'+item.id)) parts.push('First taste: '+(bonus==='maxHP'?'+2 max HP':bonus==='accuracy'?'+1% accuracy':'+1 '+bonus)+' permanently');
  if(item.armor) parts.push('Block '+item.armor.dr+' damage · '+item.armor.durabilityHits+' hits');
  if(item.tempWeapon) parts.push('3 swings · damage shown in combat');
  if(item.buff) parts.push(item.message);
  return parts.join(' / ') || 'Local advice';
}
function applyPermanentPurchase(bizId,item) {
  if(item.skill) { Game.learned.push(item.skill); Game.training.push(item.id); appendSpecial('LEARNED: '+(CONFIG.abilities[item.skill]?.name||'Counterattack')+'. Yours for the rest of this run.'); }
  if(item.defense) { Game.permanent.defense+=item.defense; Game.training.push(item.id); appendSpecial('Defense permanently increased by 1.'); }
  const key=bizId+':'+item.id, bonus=foodBonus(item);
  if(bonus&&!Game.tasted.includes(key)) {
    Game.tasted.push(key);
    if(bonus==='maxHP') { Game.maxHP+=2; Game.hp=Math.min(Game.maxHP,Game.hp+2); }
    else Game.permanent[bonus]+=bonus==='accuracy'?.01:1;
    appendSpecial('FIRST TASTE: '+(bonus==='maxHP'?'+2 max HP':bonus==='accuracy'?'+1% accuracy':'+1 '+bonus)+' permanently.');
  }
}
function describeButton(button,text) {
  const detail=document.createElement('small');detail.textContent=text;button.appendChild(detail);button.classList.add('shop-item');
}
function describeActionButton(button,text) {
  const detail=document.createElement('small');detail.className='action-detail';detail.textContent=text;button.appendChild(detail);
}
function showDirectory(arrival='') {
  if(Game.scene==='combat'||Game.scene==='victory'||Game.scene==='gameover'||StoryType.holdLock||StoryType.typing) return;
  Game.scene='directory';Game.enemy=null;Game.businessEntered=false;Game.artEncounter=null;
  const here=streetNumber(), cleared=streetCleared();
  $('#story').innerHTML='';updateStats();updateHealthMeters();clearButtons();
  if(arrival)appendStory(arrival,'news');
  appendStory('You are on '+getStreet(here).name+'.','special');
  appendStory(STREET_LANDMARKS[here-1]+'.','system');
  const required=winsRequiredForStreet(Game.level), regularRequired=required-1;
  appendStory(cleared?'This street is clear. The fight is on '+getStreet(activeStreet()).name+'.':Game.aliensThisLevel+' of '+required+' fights won. '+(Game.aliensThisLevel===regularRequired?'The boss is hiding here.':(regularRequired-Game.aliensThisLevel)+' more before the boss.'),'system');
  if(here===10&&!cleared)appendStory('Two guards, then the Mothership Commander. No shops on the harbor.','special');
  const bossReady=!cleared&&Game.aliensThisLevel===regularWinsRequired(Game.level);
  const exploreButton=addButton(cleared?'Explore Safely':'Explore Street',()=>encounter());
  describeActionButton(exploreButton,cleared?'Shops, rumors, and anything still hidden. No aliens.':bossReady?'The district boss is hiding on this street.':'Aliens, rumors, and hidden caches.');
  for(const id of availableShopIds()){
    if((Game.knownShops||[]).includes(id)) addButton(getBusiness(id).name,()=>startBusiness(id));
    else addButton('Unknown stop',()=>{},true);
  }
  const index=routeIndex(here);
  if(index>=0&&index<9){
    const next=Game.route[index+1], unlocked=routeIndex(next)<=Game.level-1;
    if(unlocked){
      const travelButton=addButton(getStreet(next).name+' · '+(routeIndex(next)<Game.level-1?'Cleared':'Active')+' →',()=>travelToStreet(next));
      travelButton.classList.add('travel-button');
      if(Game.newlyUnlockedStreet===next){travelButton.classList.add('new-street');travelButton.setAttribute('aria-label','New street unlocked: '+getStreet(next).name);}
    }
    else appendStory(getStreet(next).name+' is locked until you beat the boss.','system');
  }
  saveGame();
}
async function huntAlien() {
  if(streetCleared()||Game.scene!=='directory'||StoryType.holdLock||StoryType.typing)return;
  beginTurnLock();Game.scene='hunting';clearButtons();
  const meter=$('#huntMeter'), progress=$('#huntProgress');
  progress.value=0;$('#huntStatus').textContent='Searching '+getStreet(streetNumber()).name+'…';meter.hidden=false;
  $('#story').innerHTML='';appendStory('You follow distant footsteps and scan the shadows for an alien.','system');
  try {
    for(let step=1;step<=10;step++){
      await sleep(250);progress.value=step*10;
      if(step===5)$('#huntStatus').textContent='Movement spotted. Closing in…';
    }
    startCombat();
  } finally {meter.hidden=true;endTurnLock();}
}
function addDirectoryReturn() {
  const roaming=['explore','empty','npc'].includes(Game.scene);
  if(roaming || (Game.scene==='business'&&!Game.businessEntered)) {
    const button=addButton('Back to Directory',()=>showDirectory());
    button.classList.add('directory-return');
  }
}
function updateCampaignHUD() {
  const directory=$('#directoryBtn');
  directory.disabled=['combat','victory','gameover','start'].includes(Game.scene)||StoryType.holdLock||StoryType.typing;
  directory.title=Game.scene==='hunting'?'Searching for an alien. Wait for the search meter to fill.':Game.scene==='combat'?'Finish the fight for an automatic bounty, or flee, to visit shops.':StoryType.holdLock||StoryType.typing?'Wait for the text to finish. You can enable Instant text in Text Settings.':'Return to shops, training, and your district progress.';
  $('#recoverBtn').disabled=StoryType.holdLock||StoryType.typing;
  $('#campaignProgress').textContent='STREET '+streetNumber()+'/10 · '+(streetCleared()?'CLEARED · SAFE':Game.aliensThisLevel+'/'+winsRequiredForStreet(Game.level)+' WINS');
  $('#combatIntent').textContent=Game.scene==='combat'&&Game.enemy?enemyIntent().hint:'';
}
function scaleEnemyHealth(hp,level=Game.level) { return Math.round(hp*(1+.025*(level-1))); }
function enemyIntent() {
  const L=Game.level, boss=Game.enemy?.isBoss?2:0;
  const profiles={
    blue:{name:'quick photon jab',hit:.85,minDamage:2,maxDamage:5,hint:'BLUE / Fast, accurate strikes. Guard cuts damage in half.'},
    green:{name:'crushing lunge',hit:.65,minDamage:5,maxDamage:9,hint:'GREEN / Heavy swings, lower accuracy. Guard the big hit.'},
    grey:{name:'mind pulse',hit:.75,minDamage:3,maxDamage:6,hint:'GREY / Mind pulses ignore worn armor. Conditioning and guard still work.',pierce:true},
    red:{name:'rage beam',hit:.75,minDamage:3,maxDamage:7,hint:'RED / Damage rises each round. Finish it quickly.'}
  };
  const p=profiles[Game.enemy?.color]||profiles.blue;
  const rage=Game.enemy?.color==='red'?Math.min(4,Game.turnsThisFight||0):0;
  const pressure=Math.floor((L-1)/3);
  return {...p,minDamage:p.minDamage+Math.floor(L/2)+boss+rage+pressure,maxDamage:p.maxDamage+Math.floor(L/2)+boss+rage+pressure};
}
function useWeaponCharge() { Game.weaponUses=Math.max(0,(Game.weaponUses||1)-1);Game.tempWeaponUsed=Game.weaponUses===0; }
async function guardTurn() {
  if(Game.scene!=='combat'||!Game.enemy||Game.enemy.hp<=0||StoryType.holdLock) return;
  beginTurnLock();Game.turnsThisFight++;Game.guarding=true;Game.blockedHit=false;
  await appendStoryAsync('You brace for the next attack. Incoming damage is halved.','system');
  await enemyTurnSequence();Game.guarding=false;
  if(Game.hp>0&&Game.enemy&&Game.blockedHit&&Game.learned.includes('counter')) {
    const damage=5+Game.level+Game.permanent.punch;
    Game.enemy.hp=Math.max(0,Game.enemy.hp-damage);
    await appendStoryAsync('COUNTERATTACK! You return '+damage+' damage.','hit');
  }
  const won=Game.hp>0&&Game.enemy&&Game.enemy.hp<=0;
  if(Game.hp>0&&Game.enemy) { updateStats();updateHealthMeters();if(won)winCombat();else updateCombatButtons(); }
  endTurnLock();if(won)collectReward();
}
function recoverAtShelter() {
  window.trackGameEvent?.('shelter_recovery');
  const loss=Math.ceil(Game.money*.25);
  if(Game.weaponUses<=0)Game.tempWeapon=null;
  Game.money-=loss;Game.hp=Game.maxHP;Game.scene='explore';Game.enemy=null;Game.pendingReward=0;Game.guarding=false;
  Game.buffs=null;$('#overlay').style.display='none';showDirectory();
  appendStory('Neighbors brought you to shelter. Lost $'+loss+'. Your training and district progress are intact.','system');saveGame();
}
const SAVE_FIELDS=Object.keys(Game);
function saveGame() {
  if(Game.scene==='start'||StoryType.holdLock) return;
  try {
    const state={};for(const key of SAVE_FIELDS)state[key]=Game[key];
    const data=JSON.stringify({version:2,state},(key,value)=>value instanceof Set?{setValues:[...value]}:value);
    localStorage.setItem(SAVE_KEY,data);$('#saveStatus').textContent='PROGRESS SAVED';
  } catch { $('#saveStatus').textContent='SAVE UNAVAILABLE · KEEP THIS TAB OPEN'; }
}
function readSave() {
  try {
    const raw=localStorage.getItem(SAVE_KEY);if(!raw)return null;
    const parsed=JSON.parse(raw);const s=parsed.state;
    if(![1,2].includes(parsed.version)||!s||!Number.isInteger(s.level)||s.level<1||s.level>10||!Number.isFinite(s.hp)||s.hp<0||!Number.isFinite(s.maxHP)||s.maxHP<1||s.maxHP>1000||s.hp>s.maxHP||!Number.isFinite(s.money)||s.money<0||s.money>1000000) return null;
    const expectedWins=winsRequiredForStreet(s.level);
    if(!Number.isInteger(s.aliensThisLevel)||s.aliensThisLevel<0||s.aliensThisLevel>expectedWins||![3,4].includes(s.requiredThisLevel)||s.highestDistrict!==s.level) return null;
    if(s.level>=4&&s.level<=9&&s.requiredThisLevel===3&&s.scene==='combat'&&s.enemy?.isBoss)s.aliensThisLevel=3;
    s.requiredThisLevel=expectedWins;
    if(!Array.isArray(s.route)||s.route.length!==10||new Set(s.route).size!==10||s.route.some(n=>!Number.isInteger(n)||n<1||n>10)) s.route=defaultRoute();
    if(parsed.version===1)s.currentStreet=s.level;
    // Ignore retired first-fight hints in older checkpoints.
    delete s.tutorialSeen;
    if(s.enemy)delete s.enemy.tutorialTackleReady;
    if(!Number.isInteger(s.currentStreet)||!s.route.slice(0,s.level).includes(s.currentStreet)||(s.scene==='combat'&&s.currentStreet!==s.route[s.level-1]))return null;
    if(!Array.isArray(s.learned)||s.learned.some(k=>!TRAINING.some(t=>t.skill===k))||!Array.isArray(s.training)||s.training.some(k=>!TRAINING.some(t=>t.id===k))||!Array.isArray(s.tasted)||s.tasted.some(k=>typeof k!=='string'))return null;
    if(!s.permanent||!['punch','kick','defense','accuracy'].every(k=>Number.isFinite(s.permanent[k])&&s.permanent[k]>=0&&s.permanent[k]<=30))return null;
    const object=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
    if(!['loyalty','visitPaidCounts','visitFreeDollarUsed','purchasedThisVisit','abilitiesUsed'].every(k=>object(s[k])))return null;
    if(!Array.isArray(s.lastEncounters)||!Number.isInteger(s.aliensDefeated)||s.aliensDefeated<0||!Number.isInteger(s.turnsThisFight)||s.turnsThisFight<0||!Number.isInteger(s.weaponUses)||s.weaponUses<0||s.weaponUses>3)return null;
    if(s.secretsFound!=null&&(!Array.isArray(s.secretsFound)||s.secretsFound.some(id=>typeof id!=='string')))return null;
    if(s.knownShops!=null&&(!Array.isArray(s.knownShops)||s.knownShops.some(id=>typeof id!=='string')))return null;
    if(s.exploreSeed!=null&&(!Number.isInteger(s.exploreSeed)||s.exploreSeed<1))return null;
    if(s.streetDecks!=null&&(typeof s.streetDecks!=='object'||Array.isArray(s.streetDecks)))return null;
    if(s.deckBuilds!=null&&(typeof s.deckBuilds!=='object'||Array.isArray(s.deckBuilds)))return null;
    if(s.streetSeen!=null&&(typeof s.streetSeen!=='object'||Array.isArray(s.streetSeen)))return null;
    if(s.tempWeapon!==null&&!Object.hasOwn(TEMP_WEAPONS,s.tempWeapon))return null;
    if(s.armor!==null&&(!object(s.armor)||typeof s.armor.name!=='string'||!Number.isFinite(s.armor.dr)||!Number.isFinite(s.armor.durabilityHits)))return null;
    if(s.buffs!==null&&!object(s.buffs))return null;
    if(!['intro','explore','directory','business','npc','empty','combat','victory','gameover'].includes(s.scene))return null;
    if(s.scene==='combat'&&(!s.enemy||!CONFIG.enemyTypes.includes(s.enemy.color)||!Number.isFinite(s.enemy.hp)||s.enemy.hp<0||!Number.isFinite(s.enemy.maxHP)||s.enemy.maxHP<=0||s.enemy.hp>s.enemy.maxHP||!Number.isFinite(s.pendingReward)||s.pendingReward<0))return null;
    return s;
  } catch { return null; }
}
function continueGame() {
  const state=readSave();if(!state)return;
  for(const key of SAVE_FIELDS)if(Object.hasOwn(state,key))Game[key]=state[key];
  Game.purchasedThisVisit={};for(const [id,value]of Object.entries(state.purchasedThisVisit||{}))if(getBusiness(id))Game.purchasedThisVisit[id]=new Set(Array.isArray(value?.setValues)?value.setValues:[]);
  window.trackGameEvent?.('game_resume', {saved_scene:Game.scene});
  Game.guarding=false;Game.secretsFound=Array.isArray(Game.secretsFound)?Game.secretsFound:[];Game.knownShops=Array.isArray(Game.knownShops)?Game.knownShops:[];
  if(!Number.isInteger(Game.exploreSeed))Game.exploreSeed=1;Game.streetDecks=Game.streetDecks||{};Game.deckBuilds=Game.deckBuilds||{};Game.streetSeen=Game.streetSeen||{};showGameUI();$('#story').innerHTML='';updateStats();updateHealthMeters();
  if(Game.scene==='victory'){gameVictory();return;}
  if(Game.hp<=0||Game.scene==='gameover'){gameOver(false);return;}
  if(Game.scene==='combat') {
    if(Game.enemy.hp<=0)collectReward();
    else {appendStory('Resumed your encounter with '+enemyLabel()+'.','system');updateCombatButtons();}
  } else if(Game.scene==='intro') showDepartures();
  else { Game.scene='explore';showDirectory(); }
}
function openBuild() {
  const names=id=>TRAINING.filter(item=>(DISTRICT_SHOPS[id-1]||[]).includes(TRAINING_SHOPS[item.id])&&(Game.knownShops||[]).includes(TRAINING_SHOPS[item.id])).map(item=>item.name);
  const moves=Object.keys(CONFIG.abilities).filter(key=>CONFIG.abilities[key].unlockLevel===1||Game.learned.includes(key));
  $('#buildKnown').textContent=moves.map(key=>{
    const ability=CONFIG.abilities[key];
    const bonus=/kick/i.test(key)?Game.permanent.kick:Game.permanent.punch;
    const min=ability.minDamage+Game.level+bonus, max=ability.maxDamage+Game.level+bonus;
    return ability.name+' · '+Math.round(attackHitChance(ability)*100)+'% · '+min+'–'+max;
  }).concat([Game.learned.includes('counter')?'Guard, then counter':'Guard']).join('\n');
  const bonus=[];
  if(Game.permanent.punch)bonus.push('Punch damage +'+Game.permanent.punch);
  if(Game.permanent.kick)bonus.push('Kick damage +'+Game.permanent.kick);
  if(Game.permanent.defense)bonus.push('Defense +'+Game.permanent.defense);
  if(Game.permanent.accuracy)bonus.push('Accuracy +'+Math.round(Game.permanent.accuracy*100)+'%');
  $('#buildStats').hidden=!bonus.length;
  $('#buildStats').textContent=bonus.join(' · ');
  const hereTrain=names(streetNumber()), nextIndex=routeIndex(streetNumber())+1, nextTrain=nextIndex<10?names(Game.route[nextIndex]):[];
  $('#buildHere').textContent=hereTrain.length?hereTrain.join(', '):'No training found on this street yet.';
  $('#buildNext').textContent=nextTrain.length?nextTrain.join(', '):'You have not found training on the next street.';
  $('#buildPanel').showModal();
}
function showDepartures() {
  Game.scene='intro';Game.artEncounter=null;clearButtons();
  appendStory('Public Square, 1989. The Rapid runs under Terminal Tower. Buses still roll out Euclid. A cab idles at the curb.','system');
  const walk=addButton('Explore on foot',()=>arriveByTransit(1,'You stay on foot. Public Square is as far as you get. The fight starts on Ontario.'));
  describeActionButton(walk,'Ontario start.');
  const bus=addButton('Take the bus',boardBus);
  describeActionButton(bus,'Euclid or Superior.');
  const rapid=addButton('Take the Rapid',boardRapid);
  describeActionButton(rapid,'Public Square, Prospect, or Huron.');
  const cab=addButton('Hail a cab',boardCab);
  describeActionButton(cab,'East 9th or West 6th.');
}
function boardCab() {
  if(Math.random()<0.5){
    Game.scene='intro';Game.artEncounter='cab-scared';clearButtons();
    appendStory('The driver catches the radio. Aliens on East 9th. He stops the meter and looks back at you.','special');
    addButton('Get out on East 9th',()=>arriveByTransit(4,'The cab disappears into the rain. Your fight starts on East 9th.'));
    return;
  }
  Game.scene='intro';Game.artEncounter='cab-singing';clearButtons();
  appendStory('The driver sings over the radio and misses the emergency bulletin.','special');
  addButton('Ride to West 6th',()=>arriveByTransit(6,'The cab leaves you by the warehouses on West 6th.'));
}
function boardBus() {
  if(Math.random()<0.5){
    Game.scene='intro';Game.artEncounter='bus-zapped';clearButtons();
    appendStory('An alien zap blows a tire before Euclid.','special');
    addButton('Wait for the next bus',()=>arriveByTransit(3,'You wait in the rain. The next bus leaves you on Euclid. Lost 8 HP.',8));
    addButton('Walk',()=>arriveByTransit(2,'You leave the bus and walk. Superior is where the fight starts.'));
    return;
  }
  arriveByTransit(3,'The bus makes it. You step off on Euclid.');
}
function boardRapid() {
  if(Math.random()<0.5){
    Game.scene='intro';Game.artEncounter='rapid-stalled';clearButtons();
    appendStory('The Rapid dies in the trench under Terminal Tower.','special');
    addButton('Square doors',()=>arriveByTransit(1,'You wait, then take the Public Square doors. Lost 8 HP. The fight starts on Ontario.',8));
    addButton('Prospect doors',()=>arriveByTransit(8,'Staff open the south doors. You come out on Prospect.'));
    addButton('Climb out of the trench',()=>arriveByTransit(9,'You climb out of the trench by the Huron viaduct.'));
    return;
  }
  Game.scene='intro';Game.artEncounter='rapid-running';clearButtons();
  appendStory('The Rapid keeps moving through the trench while passengers watch the sky.','system');
  addButton('Ride to Public Square',()=>arriveByTransit(1,'The Rapid pulls into Tower City. You come up into Public Square.'));
}
function arriveByTransit(street,text,hpLoss=0) {
  Game.route=buildRoute(street);
  Game.currentStreet=street;Game.level=1;Game.highestDistrict=1;Game.aliensThisLevel=0;Game.requiredThisLevel=winsRequiredForStreet(1);
  Game.hp=Math.max(1,Game.hp-(hpLoss||0));Game.scene='explore';Game.streetJustChanged=false;Game.artEncounter=null;
  showDirectory(text);
}
function startNewRun() { if(readSave()&&!confirm('Start a new run? This replaces your saved campaign.'))return;newGame(); }
window.addEventListener('DOMContentLoaded',()=>{
  const save=readSave();$('#continueRun').hidden=!save;
  if(save)$('#continueRun').textContent='CONTINUE · STREET '+save.currentStreet;
});

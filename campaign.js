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
CONFIG.abilities.superKick.name='Lake Effect Kick';
CONFIG.abilities.superKick.damageMultiplier=1;
CONFIG.abilities.superPunch.name='Ironworks Punch';
CONFIG.abilities.superPunch.damageMultiplier=1;
CONFIG.abilities.superPunch.minDamage=28;
CONFIG.abilities.superPunch.maxDamage=36;
CONFIG.abilities.throwEnemy.hit=.9;
CONFIG.abilities.spinningKick.hit=.8;
const FOOD_POWER = {coffee:'accuracy',donut:'maxHP',burger:'punch',corned:'punch',jerky:'punch',generaltso:'kick',eggroll:'kick',hottea:'accuracy',milkshake:'maxHP'};
function initCampaign() {
  Object.assign(Game,{learned:[],training:[],tasted:[],permanent:{punch:0,kick:0,defense:0,accuracy:0},
    highestDistrict:1,currentStreet:1,finalBossDefeated:false,guarding:false,blockedHit:false,tempWeapon:null,weaponUses:0,tempWeaponUsed:false,
    currentBiz:null,businessEntered:false,artEncounter:null});
}
initCampaign();
function streetNumber() { return Game.currentStreet; }
function streetCleared() { return streetNumber()<Game.level || Game.finalBossDefeated; }
function availableShopIds() { return DISTRICT_SHOPS[streetNumber()-1] || []; }
function canVisitShop(id) { return availableShopIds().includes(id) && !['combat','victory','gameover'].includes(Game.scene); }
function travelToStreet(destination) {
  if(!Number.isInteger(destination)||Math.abs(destination-streetNumber())!==1||destination<1||destination>Game.highestDistrict) return;
  if(['start','combat','victory','gameover'].includes(Game.scene)||StoryType.holdLock||StoryType.typing) return;
  const from=getStreet(streetNumber());
  window.trackGameEvent?.('street_travel', {from_street:streetNumber(),to_street:destination});
  Game.currentStreet=destination;Game.scene='explore';Game.currentBiz=null;Game.businessEntered=false;Game.artEncounter=null;
  Game.lastEncounters=[];Game.lastBusiness=null;Game.streetJustChanged=false;
  showDirectory('You walk from '+from.name+' to '+getStreet(destination).name+'. '+(destination<Game.level?getStreet(destination).cleared:getStreet(destination).enter));
}
function streetOfferings(number) {
  const shops=DISTRICT_SHOPS[number-1];
  const training=TRAINING.filter(item=>shops.includes(TRAINING_SHOPS[item.id])).map(item=>item.name);
  return (shops.length?shops.map(id=>getBusiness(id).name).join(', '):'No shops. Prepare on Huron before the final assault.')+(training.length?' / Training: '+training.join(', '):'');
}
function foodBonus(item) { return item.healing>0 && !item.armor && !['lotto','bandages'].includes(item.id) ? (FOOD_POWER[item.id] || 'maxHP') : null; }
function itemOwned(item) { return !!((item.skill||item.defense) && Game.training.includes(item.id)); }
function itemDescription(bizId,item) {
  if(item.skill||item.defense) return itemOwned(item)?'OWNED · permanent training':item.description+(item.requires&&!Game.training.includes(item.requires)?' Requires previous conditioning.':'');
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
  appendStory('STREET DIRECTORY / '+getStreet(here).name,'special');
  appendStory('LANDMARK / '+STREET_LANDMARKS[here-1],'system');
  const required=winsRequiredForStreet(here), regularRequired=required-1;
  appendStory(cleared?'STREET CLEARED. Safe to revisit: no battles here. The active fight is on '+getStreet(Game.level).name+'.':'Street progress: '+Game.aliensThisLevel+'/'+required+' victories. '+(Game.aliensThisLevel===regularRequired?'The district boss is next.':(regularRequired-Game.aliensThisLevel)+' regular fight'+(regularRequired-Game.aliensThisLevel===1?'':'s')+' until the district boss.'),'system');
  appendStory('LOCAL STOPS / '+streetOfferings(here),'system');
  appendStory('Build: Punch +'+Game.permanent.punch+' · Kick +'+Game.permanent.kick+' · Defense +'+Game.permanent.defense+' · Accuracy +'+Math.round(Game.permanent.accuracy*100)+'%.','system');
  appendStory('Training: '+(Game.learned.map(k=>CONFIG.abilities[k]?.name||'Counterattack').join(', ')||'None yet. Find basic tapes at the Record Store on Ontario.'),'system');
  if(here===10)appendStory('Erieside: defeat the two guards, then the Mothership Commander. No shops on the harbor.','special');
  if(!cleared){
    const bossReady=Game.aliensThisLevel===regularWinsRequired(here);
    addButton(bossReady?'Challenge District Boss':'Hunt an Alien',()=>{if(bossReady){$('#story').innerHTML='';startCombat();}else return huntAlien();});
  }
  const exploreButton=addButton(cleared?'Explore Safely':'Explore Street',()=>encounter());
  describeActionButton(exploreButton,cleared?'No aliens remain here.':'Random event or alien encounter.');
  for(const id of availableShopIds())addButton(getBusiness(id).name,()=>startBusiness(id));
  if(here>1){
    const previous=here-1;
    addButton('← '+getStreet(previous).name+' · '+(previous<Game.level?'Cleared':'Active'),()=>travelToStreet(previous)).classList.add('travel-button');
  }
  if(here<10){
    const next=here+1, unlocked=next<=Game.highestDistrict;
    if(unlocked)addButton(getStreet(next).name+' · '+(next<Game.level?'Cleared':'Active')+' →',()=>travelToStreet(next)).classList.add('travel-button');
    appendStory((unlocked?'ROAD OPEN / '+getStreet(next).name:'ROAD LOCKED / Defeat the district boss to reach '+getStreet(next).name)+' — '+streetOfferings(next),'system');
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
    const button=addButton('Return to Street Directory',()=>showDirectory());
    button.classList.add('directory-return');
  }
}
function updateCampaignHUD() {
  const directory=$('#directoryBtn');
  directory.disabled=['combat','victory','gameover','start'].includes(Game.scene)||StoryType.holdLock||StoryType.typing;
  directory.title=Game.scene==='hunting'?'Searching for an alien. Wait for the search meter to fill.':Game.scene==='combat'?'Finish the fight for an automatic bounty, or flee, to visit shops.':StoryType.holdLock||StoryType.typing?'Wait for the text to finish. You can enable Instant text in Text Settings.':'Return to shops, training, and your district progress.';
  $('#recoverBtn').disabled=StoryType.holdLock||StoryType.typing;
  $('#campaignProgress').textContent='STREET '+streetNumber()+'/10 · '+(streetCleared()?'CLEARED · SAFE':Game.aliensThisLevel+'/'+winsRequiredForStreet(streetNumber())+' WINS');
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
    if(parsed.version===1)s.currentStreet=s.level;
    // Ignore retired first-fight hints in older checkpoints.
    delete s.tutorialSeen;
    if(s.enemy)delete s.enemy.tutorialTackleReady;
    if(!Number.isInteger(s.currentStreet)||s.currentStreet<1||s.currentStreet>s.highestDistrict||(s.scene==='combat'&&s.currentStreet!==s.level))return null;
    if(!Array.isArray(s.learned)||s.learned.some(k=>!TRAINING.some(t=>t.skill===k))||!Array.isArray(s.training)||s.training.some(k=>!TRAINING.some(t=>t.id===k))||!Array.isArray(s.tasted)||s.tasted.some(k=>typeof k!=='string'))return null;
    if(!s.permanent||!['punch','kick','defense','accuracy'].every(k=>Number.isFinite(s.permanent[k])&&s.permanent[k]>=0&&s.permanent[k]<=30))return null;
    const object=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
    if(!['loyalty','visitPaidCounts','visitFreeDollarUsed','purchasedThisVisit','abilitiesUsed'].every(k=>object(s[k])))return null;
    if(!Array.isArray(s.lastEncounters)||!Number.isInteger(s.aliensDefeated)||s.aliensDefeated<0||!Number.isInteger(s.turnsThisFight)||s.turnsThisFight<0||!Number.isInteger(s.weaponUses)||s.weaponUses<0||s.weaponUses>3)return null;
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
  Game.guarding=false;showGameUI();$('#story').innerHTML='';updateStats();updateHealthMeters();
  if(Game.scene==='victory'){gameVictory();return;}
  if(Game.hp<=0||Game.scene==='gameover'){gameOver(false);return;}
  if(Game.scene==='combat') {
    if(Game.enemy.hp<=0)collectReward();
    else {appendStory('Resumed your encounter with '+enemyLabel()+'.','system');updateCombatButtons();}
  } else { Game.scene='explore';showDirectory(); }
}
function startNewRun() { if(readSave()&&!confirm('Start a new run? This replaces your saved campaign.'))return;newGame(); }
window.addEventListener('DOMContentLoaded',()=>{
  const save=readSave();$('#continueRun').hidden=!save;
  if(save)$('#continueRun').textContent='CONTINUE · STREET '+save.currentStreet;
});

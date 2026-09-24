const {context,el,storage,vm,assert}=require('./art-integration.cjs');
async function main(){
await vm.runInContext(`(async()=>{
newGame();assert.equal(Game.money,8);assert.equal(Game.learned.length,0);
assert.ok(businesses.every(b=>b.items.length<=3),'Every store is capped at three purchasable items');
// Every non-combat encounter has a visible route back, including after dialogue.
for(const [start,action] of [[startMisc,'Watch'],[startNews,'Read'],[startNPC,'Talk'],[startPolice,'Talk'],[startEmpty,'Look Around'],[()=>announceBusiness('coffee'),null]]) {
 start();assert.ok(el('#buttons').children.some(b=>b.textContent==='Back to Directory'));
 if(el('#buttons').children.some(b=>b.textContent==='Keep Exploring')){
  if(action)assert.equal(el('#buttons').children[0].textContent,action);
  assert.equal(el('#buttons').children.at(-2).textContent,'Keep Exploring');
  assert.equal(el('#buttons').children.at(-1).textContent,'Back to Directory');
 }
 if(action)el('#buttons').children.find(b=>b.textContent===action).onclick({});
 el('#buttons').children.find(b=>b.textContent==='Back to Directory').onclick({});
 assert.equal(Game.scene,'directory');assert.equal(Game.enemy,null);
}
startCombat();assert.ok(!el('#buttons').children.some(b=>b.textContent==='Back to Directory'));assert.equal(el('#directoryBtn').disabled,true);
el('#buttons').children.find(b=>b.textContent==='Flee').onclick({});
el('#buttons').children.find(b=>b.textContent==='Back to Directory').onclick({});assert.equal(Game.scene,'directory');
StoryType.typing=true;updateCampaignHUD();assert.equal(el('#directoryBtn').disabled,true);StoryType.typing=false;updateCampaignHUD();assert.equal(el('#directoryBtn').disabled,false);
newGame();
assert.equal(availableShopIds().join(','),'coffee,pawn,record');
Game.money=200;Game.currentStreet=Game.level=Game.highestDistrict=3;startBusiness('arcade');
const tape=getBusiness('arcade').items.find(x=>x.id==='superKick');
buyBusinessItem('arcade',tape);assert.ok(Game.learned.includes('superKick'));
const afterTape=Game.money;buyBusinessItem('arcade',tape);assert.equal(Game.money,afterTape);
startBusiness('arcade');buyBusinessItem('arcade',tape);assert.equal(Game.money,afterTape,'Owned training cannot be bought twice');
Game.scene='directory';travelToStreet(2);startBusiness('thrift');
const training2=getBusiness('thrift').items.find(x=>x.id==='conditioning2');
buyBusinessItem('thrift',training2);assert.equal(Game.permanent.defense,0,'Prerequisite enforced');
startBusiness('drugstore');buyBusinessItem('drugstore',getBusiness('drugstore').items.find(x=>x.id==='conditioning1'));
startBusiness('thrift');buyBusinessItem('thrift',training2);assert.equal(Game.permanent.defense,2);
const jacket=getBusiness('thrift').items.find(x=>x.id==='jacket');
const beforeJacket=Game.money;buyBusinessItem('thrift',jacket);const afterJacket=Game.money;
assert.ok(afterJacket<beforeJacket);startBusiness('thrift');buyBusinessItem('thrift',jacket);assert.equal(Game.money,afterJacket,'Owned armor cannot be bought again');
Game.scene='directory';travelToStreet(1);startBusiness('coffee');const donut=getBusiness('coffee').items.find(x=>x.id==='donut');
const hp=Game.maxHP;buyBusinessItem('coffee',donut);assert.equal(Game.maxHP,hp+2);
startBusiness('coffee');buyBusinessItem('coffee',donut);assert.equal(Game.maxHP,hp+2,'First-taste bonus only once');
startBusiness('pawn');buyBusinessItem('pawn',getBusiness('pawn').items[0]);assert.equal(Game.weaponUses,3);
useWeaponCharge();decayBuffsEndOfFight();assert.ok(Game.tempWeapon);assert.equal(Game.weaponUses,2);
useWeaponCharge();useWeaponCharge();decayBuffsEndOfFight();assert.equal(Game.tempWeapon,null);
Game.scene='directory';travelToStreet(2);travelToStreet(3);startCombat();assert.equal(Game.enemy.isBoss,false);
Game.enemy.hp=0;Game.turnsThisFight=1;const beforeBounty=Game.money;winCombat();const quick=Game.money-beforeBounty;
assert.ok(quick>0);assert.equal(Game.pendingReward,0);assert.ok(!el('#buttons').children.some(b=>b.textContent.startsWith('Collect $')),'Bounties progress automatically');
assert.ok(el('#buttons').children.length>0,'Winning a fight restores directory actions');
Game.buffs={fights:1,firstHitGuaranteed:false,damageTakenMult:1,enemyFirstTurnMissBonus:0};Game.scene='combat';Game.enemy=makeEnemy(false);Game.enemy.hp=0;
winCombat();assert.equal(Game.scene,'directory');assert.ok(el('#buttons').children.length>0,'Expiring fight buffs cannot swallow post-fight buttons');
const afterBuffWin=Game.money;Game.turnsThisFight=20;winCombat();collectReward();assert.equal(Game.money,afterBuffWin,'Rewards collected only once');
Game.scene='explore';saveGame();const savedMoney=Game.money;const savedMax=Game.maxHP;
Game.money=0;Game.learned=[];continueGame();assert.equal(Game.money,savedMoney);assert.ok(Game.learned.includes('superKick'));assert.equal(Game.maxHP,savedMax);
startCombat();Game.enemy.hp-=3;Game.hp-=4;saveGame();const enemyHP=Game.enemy.hp,playerHP=Game.hp;
Game.enemy=null;continueGame();assert.equal(Game.enemy.hp,enemyHP);assert.equal(Game.hp,playerHP);
Game.enemy.hp=0;Game.pendingReward=9;saveGame();const legacyMoney=Game.money;continueGame();assert.equal(Game.pendingReward,0);assert.equal(Game.money,legacyMoney+9,'Saved unclaimed bounties resolve on resume');
saveGame();continueGame();assert.equal(Game.pendingReward,0);assert.notEqual(Game.scene,'combat');
Game.money=40;Game.hp=0;gameOver();assert.equal(el('#recoverBtn').hidden,false);recoverAtShelter();assert.equal(Game.money,30);assert.equal(Game.hp,Game.maxHP);assert.ok(Game.learned.includes('superKick'));
// Exhausting a weapon on a losing turn cannot restore it at the next battle.
Game.tempWeapon='leadPipe';Game.weaponUses=0;Game.tempWeaponUsed=true;Game.hp=0;gameOver();recoverAtShelter();startCombat();assert.equal(Game.tempWeapon,null);
// Checkpoints remain at the start of an in-flight turn.
startCombat();saveGame();const before=localStorage.getItem(SAVE_KEY);beginTurnLock();Game.hp-=1;saveGame();assert.equal(localStorage.getItem(SAVE_KEY),before);endTurnLock();assert.notEqual(localStorage.getItem(SAVE_KEY),before);
// Guard, defense, species behavior, and a purchased counter actually affect combat.
newGame();Game.learned=['counter'];Game.hp=Game.maxHP=100;Game.scene='combat';Game.enemy={name:'green',color:'green',hp:100,maxHP:100};
const random=Math.random;Math.random=()=>0;await guardTurn();assert.equal(Game.hp,98);assert.equal(Game.enemy.hp,94);assert.equal(Game.guarding,false);
Game.enemy.color='grey';assert.equal(enemyIntent().pierce,true);
Game.enemy.color='red';Game.turnsThisFight=0;const base=enemyIntent().maxDamage;Game.turnsThisFight=3;assert.equal(enemyIntent().maxDamage,base+3);Math.random=random;
// Reach the finale through the real reward/progression functions.
newGame();let bosses=0;
for(let win=1;win<=36;win++){
 if(Game.currentStreet<Game.level)travelToStreet(Game.currentStreet+1);
 startCombat();if(Game.enemy.isBoss)bosses++;
 if(win<36)assert.equal(!!Game.enemy.isFinalBoss,false);
 else assert.equal(Game.enemy.isFinalBoss,true);
 Game.enemy.hp=0;winCombat();collectReward();
 if(win<36)assert.notEqual(Game.scene,'victory');
}
assert.equal(bosses,10);assert.equal(Game.scene,'victory');assert.equal(Game.aliensDefeated,36);assert.equal(Game.level,10);
assert.deepEqual(availableShopIds(),['frank']);assert.equal(Game.finalBossDefeated,true);
saveGame();continueGame();assert.equal(Game.scene,'victory');
newGame();assert.equal(Game.weaponUses,0);assert.equal(Game.training.length,0);assert.equal(Game.tasted.length,0);assert.equal(Game.finalBossDefeated,false);
const goodSave=localStorage.getItem(SAVE_KEY);
const badSave=JSON.parse(goodSave);delete badSave.state.loyalty;localStorage.setItem(SAVE_KEY,JSON.stringify(badSave));assert.equal(readSave(),null);
const write=localStorage.setItem;localStorage.setItem=()=>{throw new Error('Storage blocked');};saveGame();assert.ok(el('#saveStatus').textContent.includes('UNAVAILABLE'));localStorage.setItem=write;
localStorage.setItem(SAVE_KEY,'{broken');assert.equal(readSave(),null);
localStorage.setItem(SAVE_KEY,JSON.stringify({version:99,state:{}}));assert.equal(readSave(),null);
})()`,context);
console.log('PASS: training and prerequisites; permanent food bonuses; weapon durability; fixed rewards; double-claim prevention; save/resume including pending loot; recovery; atomic turn saves; guard/counter; species behaviors; 36-win campaign and final boss; fresh reset; invalid saves.');
}
main().catch(e=>{console.error(e);process.exitCode=1;});

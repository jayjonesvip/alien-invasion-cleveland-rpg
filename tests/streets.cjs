const {context,vm}=require('./art-integration.cjs');
vm.runInContext(`
newGame();Game.scene='explore';showDirectory();
const lockedPatrol=el('#buttons').children.find(b=>b.textContent==='Hunt an Alien (Level 2)');
assert.equal(lockedPatrol.disabled,true);lockedPatrol.onclick({});assert.equal(Game.scene,'directory');
// Exploration must still provide a complete path through the first street.
const initialRandom=Math.random;Math.random=()=>.4;
for(let tries=0;tries<30&&Game.level===1;tries++){
 encounter();
 if(Game.scene==='combat'){
  assert.equal(Game.enemy.isBoss,Game.aliensThisLevel===2);
  Game.enemy.hp=0;winCombat();collectReward();
  if(Game.level===1)assert.equal(el('#buttons').children.find(b=>b.textContent==='Hunt an Alien (Level 2)').disabled,true);
 }
}
Math.random=initialRandom;assert.equal(Game.level,2);assert.equal(Game.aliensDefeated,3);
travelToStreet(2);assert.equal(el('#buttons').children.find(b=>b.textContent==='Hunt an Alien').disabled,false);
newGame();Game.scene='explore';showDirectory();
assert.equal(streetNumber(),1);travelToStreet(2);assert.equal(streetNumber(),1,'Uncleared exit remains locked');
startBusiness('pizza');assert.equal(Game.scene,'directory','Remote shop is inaccessible');
// A boss unlocks the road without moving the player.
for(let i=0;i<3;i++){startCombat();Game.enemy.hp=0;winCombat();collectReward();}
assert.equal(Game.level,2);assert.equal(streetNumber(),1);assert.equal(streetCleared(),true);
assert.ok(!el('#buttons').children.some(b=>b.textContent==='Hunt an Alien'));
startCombat();assert.equal(Game.enemy,null,'Cleared streets cannot start battles');
const cash=Game.money, wins=Game.aliensDefeated;
travelToStreet(2);assert.equal(streetNumber(),2);assert.equal(availableShopIds().join(','),'pizza,thrift,drugstore');
assert.equal(el('#streetArt').dataset.asset,'street-superior');
startBusiness('coffee');assert.equal(Game.scene,'directory');
travelToStreet(1);assert.equal(availableShopIds().join(','),'coffee,pawn,record');
assert.equal(Game.money,cash);assert.equal(Game.aliensDefeated,wins);assert.equal(Game.level,2);
// Safe wandering never rolls a fight or the dangerous empty-street encounter.
const random=Math.random;
for(let i=0;i<30;i++){Math.random=()=>i/30;encounter();assert.notEqual(Game.scene,'combat');assert.notEqual(Game.scene,'empty');if(Game.currentBiz)assert.ok(availableShopIds().includes(Game.currentBiz));}
Math.random=random;
Game.scene='directory';Game.level=Game.highestDistrict=4;Game.aliensThisLevel=1;
travelToStreet(4);assert.equal(streetNumber(),1,'Travel cannot skip streets');
travelToStreet(2);travelToStreet(3);travelToStreet(4);
assert.equal(Game.aliensThisLevel,1,'Travel preserves the active street fight counter');
startCombat();travelToStreet(3);assert.equal(streetNumber(),4,'No travel during a fight');
Game.enemy=null;Game.scene='directory';travelToStreet(3);startBusiness('arcade');
assert.ok(getBusiness('arcade').items.some(x=>x.id==='superKick'));
assert.ok(!getBusiness('record').items.some(x=>x.id==='superKick'));
// Save the visited street separately from the campaign frontier.
saveGame();Game.currentStreet=4;continueGame();assert.equal(streetNumber(),3);assert.equal(Game.level,4);assert.equal(Game.aliensThisLevel,1);
const stored=JSON.parse(localStorage.getItem(SAVE_KEY));assert.equal(stored.version,2);
// Old saves retain money, upgrades and their frontier; existing tapes are grandfathered in.
stored.version=1;delete stored.state.currentStreet;stored.state.learned=['superKick'];stored.state.training=['superKick'];
localStorage.setItem(SAVE_KEY,JSON.stringify(stored));continueGame();assert.equal(streetNumber(),4);assert.ok(Game.learned.includes('superKick'));
const invalid=JSON.parse(localStorage.getItem(SAVE_KEY));invalid.state.currentStreet=5;localStorage.setItem(SAVE_KEY,JSON.stringify(invalid));assert.equal(readSave(),null);
// A one-shop street cannot exhaust random shop selection; the harbor has no shops.
Game.level=Game.highestDistrict=Game.currentStreet=9;Game.scene='directory';Game.lastBusiness='hotdog';announceRandomBusiness();assert.equal(Game.currentBiz,'hotdog');
Game.level=Game.highestDistrict=Game.currentStreet=10;Game.scene='directory';announceRandomBusiness();assert.equal(Game.scene,'empty');
newGame();assert.equal(streetNumber(),1);
`,context);
console.log('PASS: local shop boundaries; boss road unlock; adjacent travel; safe backtracking; travel/combat gating; distributed training; frontier preservation; version-1 save migration; harbor and one-shop encounters.');

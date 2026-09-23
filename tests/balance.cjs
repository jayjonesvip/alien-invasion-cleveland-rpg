const {context,vm}=require('./art-integration.cjs');
vm.runInContext(`(async()=>{
const oldRandom=Math.random;const runs=[];
for(let seed=1;seed<=50;seed++){
 let rng=seed;Math.random=()=>{rng=(Math.imul(rng,1664525)+1013904223)>>>0;return rng/4294967296;};
 newGame();let deaths=0,rounds=0,attempts=0;
 while(Game.scene!=='victory'&&attempts++<100){
  const walkTo=destination=>{Game.scene='directory';while(Game.currentStreet!==destination)travelToStreet(Game.currentStreet+Math.sign(destination-Game.currentStreet));};
  walkTo(Game.level);
  for(const id of availableShopIds())for(const item of getBusiness(id).items.filter(x=>x.skill&&x.skill!=='counter')){
   if(!itemOwned(item)&&Game.money>=item.price+8){startBusiness(id);buyBusinessItem(id,item);}
  }
  if(Game.hp<Game.maxHP){
   const food=DISTRICT_SHOPS.slice(0,Game.highestDistrict).flatMap((ids,i)=>ids.flatMap(id=>getBusiness(id).items.filter(item=>item.healing>0&&item.price<=Game.money).map(item=>({id,item,street:i+1}))));
   food.sort((a,b)=>Math.abs(a.street-Game.currentStreet)-Math.abs(b.street-Game.currentStreet)||a.item.price/a.item.healing-b.item.price/b.item.healing);
   if(food.length){const {id,item,street}=food[0];walkTo(street);let visits=0;while(Game.hp<Game.maxHP&&Game.money>=item.price&&visits++<30){startBusiness(id);buyBusinessItem(id,item);}}
  }
  walkTo(Game.level);
  startCombat();let turns=0;
   while(Game.hp>0&&Game.enemy&&Game.enemy.hp>0&&turns++<40){
   const usable=Object.keys(CONFIG.abilities).filter(k=>(CONFIG.abilities[k].unlockLevel===1||Game.learned.includes(k))&&!(CONFIG.abilities[k].cooldown&&Game.abilitiesUsed[k]));
   usable.sort((a,b)=>{const score=k=>{const x=CONFIG.abilities[k];return Math.min(1,x.hit+Game.permanent.accuracy)*((x.minDamage+x.maxDamage)/2+Game.level);};return score(b)-score(a);});
   await playerAttack(usable[0]);rounds++;
  }
   if(Game.hp<=0){deaths++;recoverAtShelter();}else if(!Game.enemy){/* Reward and progression resolve automatically. */}else throw new Error('Stalled battle');
 }
 if(Game.scene!=='victory')throw new Error('Campaign did not finish for seed '+seed);
 runs.push({deaths,rounds,skills:Game.learned.length});
}
Math.random=oldRandom;
return {runs:runs.length,totalDeaths:runs.reduce((s,r)=>s+r.deaths,0),maxDeaths:Math.max(...runs.map(r=>r.deaths)),averageRounds:Math.round(runs.reduce((s,r)=>s+r.rounds,0)/runs.length),minimumPurchasedSkills:Math.min(...runs.map(r=>r.skills))};
})()`,context).then(result=>console.log('BALANCE SMOKE TEST (automated shopper, not human playtest):',result)).catch(e=>{console.error(e);process.exitCode=1;});

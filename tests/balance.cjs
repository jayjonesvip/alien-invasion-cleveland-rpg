const {context,vm}=require('./art-integration.cjs');
vm.runInContext(`(async()=>{
const oldRandom=Math.random;const runs=[];
for(let seed=1;seed<=50;seed++){
 let rng=seed;Math.random=()=>{rng=(Math.imul(rng,1664525)+1013904223)>>>0;return rng/4294967296;};
 newGame();let deaths=0,rounds=0,attempts=0;
 while(Game.scene!=='victory'&&attempts++<100){
  while(Game.hp<Game.maxHP&&Game.money>=1){startBusiness('coffee');buyBusinessItem('coffee',getBusiness('coffee').items[1]);}
  for(const item of getBusiness('record').items.filter(x=>x.skill&&x.skill!=='counter')){
   if(!itemOwned(item)&&Game.money>=item.price+8){startBusiness('record');buyBusinessItem('record',item);}
  }
  startCombat();let turns=0;
  while(Game.hp>0&&Game.enemy.hp>0&&turns++<40){
   const usable=Object.keys(CONFIG.abilities).filter(k=>(CONFIG.abilities[k].unlockLevel===1||Game.learned.includes(k))&&!(CONFIG.abilities[k].cooldown&&Game.abilitiesUsed[k]));
   usable.sort((a,b)=>{const score=k=>{const x=CONFIG.abilities[k];return Math.min(1,x.hit+Game.permanent.accuracy)*((x.minDamage+x.maxDamage)/2+Game.level);};return score(b)-score(a);});
   await playerAttack(usable[0]);rounds++;
  }
  if(Game.hp<=0){deaths++;recoverAtShelter();}else if(Game.enemy.hp<=0)collectReward();else throw new Error('Stalled battle');
 }
 if(Game.scene!=='victory')throw new Error('Campaign did not finish for seed '+seed);
 runs.push({deaths,rounds,skills:Game.learned.length});
}
Math.random=oldRandom;
return {runs:runs.length,totalDeaths:runs.reduce((s,r)=>s+r.deaths,0),maxDeaths:Math.max(...runs.map(r=>r.deaths)),averageRounds:Math.round(runs.reduce((s,r)=>s+r.rounds,0)/runs.length),minimumPurchasedSkills:Math.min(...runs.map(r=>r.skills))};
})()`,context).then(result=>console.log('BALANCE SMOKE TEST (automated shopper, not human playtest):',result)).catch(e=>{console.error(e);process.exitCode=1;});

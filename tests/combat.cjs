const {context,vm}=require('./art-integration.cjs');
vm.runInContext(`(async()=>{
newGame();startCombat();
for(const color of ['blue','green','grey','red']){await playEnemyAttackFX(color);assert.equal(el('#sceneArt').classList.contains('attack-'+color),false);}
assert.ok(el('#buttons').children.some(b=>b.textContent.startsWith('Tackle · ')));
assert.ok(!el('#buttons').children.some(b=>b.textContent.includes('Guaranteed')));
const random=Math.random;Math.random=()=>.999;
const hp=Game.enemy.hp;await playerAttack('tackle');assert.equal(Game.enemy.hp,hp,'Opening tackle uses normal miss odds');
saveGame();const legacy=JSON.parse(localStorage.getItem(SAVE_KEY));legacy.state.tutorialSeen=false;legacy.state.enemy.tutorialTackleReady=true;
localStorage.setItem(SAVE_KEY,JSON.stringify(legacy));continueGame();
assert.equal(Game.enemy.tutorialTackleReady,undefined,'Old guarantee is discarded');
const savedHp=Game.enemy.hp;await playerAttack('tackle');assert.equal(Game.enemy.hp,savedHp,'Old saved first fight uses normal odds');
Game.buffs={firstHitGuaranteed:true};await playerAttack('tackle');assert.ok(Game.enemy.hp<savedHp,'Purchased guaranteed-hit buff still works');assert.notEqual(Game.buffs?.firstHitGuaranteed,true);
Math.random=()=>0;newGame();assert.equal(makeEnemy(false).maxHP,19,'Level-one alien starts at 19 HP');
Game.enemy={color:'blue'};assert.equal(enemyIntent().minDamage,2);assert.equal(enemyIntent().maxDamage,5);
Game.level=4;assert.equal(enemyIntent().minDamage,5);
Game.level=10;assert.equal(scaleEnemyHealth(120),147);assert.equal(enemyIntent().maxDamage,13);
let previous=0;for(let level=1;level<=10;level++){Game.level=level;const current=makeEnemy(false).maxHP;assert.equal(current,19+(level-1)*6);assert.ok(current>previous);previous=current;}
Game.level=10;assert.equal(makeEnemy(true).maxHP,Math.floor(73*1.6),'Boss multiplier follows the level-based curve');
Math.random=random;
})()`,context).then(()=>console.log('PASS: normal first-fight accuracy, legacy checkpoint compatibility, purchased buff, street difficulty ramp.')).catch(e=>{console.error(e);process.exitCode=1;});


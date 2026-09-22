const {context,vm}=require('./art-integration.cjs');
vm.runInContext(`(async()=>{
newGame();startCombat();
assert.equal(tutorialTackleReady(),true);assert.equal(el('#combatTutorial').hidden,false);
const guided=el('#buttons').children.find(b=>b.textContent==='Tackle · Guaranteed hit');
assert.ok(guided.classList.contains('tutorial-move'));assert.equal(guided.getAttribute('aria-describedby'),'combatTutorial');
saveGame();Game.enemy.tutorialTackleReady=false;continueGame();assert.equal(tutorialTackleReady(),true,'Reload preserves the unused opening');
const random=Math.random;Math.random=()=>.999;
const hp=Game.enemy.hp;await playerAttack('tackle');assert.ok(Game.enemy.hp<hp,'Tutorial tackle hits even on a normally missed roll');
assert.equal(tutorialTackleReady(),false);assert.equal(el('#combatTutorial').hidden,true);
assert.ok(el('#buttons').children.some(b=>b.textContent==='Tackle'));
const after=Game.enemy.hp;await playerAttack('tackle');assert.equal(Game.enemy.hp,after,'Normal odds return after one use');
continueGame();assert.equal(tutorialTackleReady(),false,'Reload cannot restore a used guarantee');
el('#buttons').children.find(b=>b.textContent==='Flee').onclick({});startCombat();assert.equal(tutorialTackleReady(),false,'Fleeing cannot restart the tutorial');
// Players can choose a different move; it does not consume the promised tackle.
newGame();startCombat();await playerAttack('punch');assert.equal(tutorialTackleReady(),true);
Game.enemy.hp=0;winCombat();collectReward();startCombat();assert.equal(tutorialTackleReady(),false,'Only the first fight is guided');
// An existing pre-tutorial save is continued without inserting a tutorial into a run.
saveGame();const legacy=JSON.parse(localStorage.getItem(SAVE_KEY));delete legacy.state.tutorialSeen;delete legacy.state.enemy.tutorialTackleReady;
localStorage.setItem(SAVE_KEY,JSON.stringify(legacy));continueGame();assert.equal(Game.tutorialSeen,true);assert.equal(tutorialTackleReady(),false);
Math.random=()=>0;newGame();assert.equal(makeEnemy(false).maxHP,19,'First-street health is unchanged');
Game.enemy={color:'blue'};assert.equal(enemyIntent().minDamage,2);assert.equal(enemyIntent().maxDamage,5);
Game.level=4;assert.equal(enemyIntent().minDamage,5,'First extra damage step on street four');
Game.level=10;assert.equal(scaleEnemyHealth(120),147);assert.equal(enemyIntent().maxDamage,13);
let previous=0;for(let level=1;level<=10;level++){Game.level=level;const current=makeEnemy(false).maxHP;assert.ok(current>previous);previous=current;}
Math.random=random;newGame();assert.equal(Game.tutorialSeen,false,'New run restores tutorial');
})()`,context).then(()=>console.log('PASS: highlighted guaranteed tackle; normal odds afterward; optional move choice; save/resume; no repeated tutorial; legacy-save compatibility; gradual street scaling.')).catch(e=>{console.error(e);process.exitCode=1;});

const {context,vm}=require('./art-integration.cjs');
vm.runInContext(`(async()=>{
newGame();Game.scene='directory';await huntAlien();assert.equal(Game.enemy,null,'Locked at level one');
Game.currentStreet=Game.level=Game.highestDistrict=2;showDirectory();saveGame();
const checkpoint=localStorage.getItem(SAVE_KEY), waits=[], realSleep=sleep;
sleep=async ms=>{waits.push(ms);};
const hunting=huntAlien();
assert.equal(Game.scene,'hunting');assert.equal(Game.enemy,null);assert.equal(el('#huntMeter').hidden,false);
assert.equal(el('#huntProgress').value,0);assert.equal(el('#directoryBtn').disabled,true);
travelToStreet(1);assert.equal(Game.currentStreet,2,'Travel is blocked while hunting');
saveGame();assert.equal(localStorage.getItem(SAVE_KEY),checkpoint,'No partial search checkpoint');
await huntAlien();await hunting;
assert.equal(waits.length,10,'Double click cannot start a second hunt');assert.equal(waits.reduce((a,b)=>a+b,0),2500);
assert.equal(el('#huntProgress').value,100);assert.equal(el('#huntMeter').hidden,true);
assert.equal(Game.scene,'combat');assert.ok(Game.enemy);assert.equal(StoryType.holdLock,false);
assert.ok(el('#buttons').children.some(b=>b.textContent==='Punch'&&!b.disabled));
assert.equal(readSave().scene,'combat','Finished search saves the encounter');sleep=realSleep;
})()`,context).then(()=>console.log('PASS: level lock; 2.5-second meter; travel and duplicate-search guards; atomic save; unlocked combat controls.')).catch(e=>{console.error(e);process.exitCode=1;});

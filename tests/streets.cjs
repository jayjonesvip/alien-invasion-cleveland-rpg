const {context,vm}=require('./art-integration.cjs');
vm.runInContext(`
function clearCurrentStreet(){
  const needed=winsRequiredForStreet(Game.level);
  for(let i=Game.aliensThisLevel;i<needed;i++){startCombat();assert.ok(Game.enemy);Game.enemy.hp=0;winCombat();collectReward();}
}

newGame();assert.equal(streetNumber(),1);assert.equal(Game.level,1);assert.equal(Game.mayorState,'pending');
assert.equal(el('#statLevel').textContent,0);
assert.equal(Game.onboardingStep,'start');assert.equal(el('#buttons').children.map(b=>b.textContent).join('|'),'Explore');
advanceOnboarding('stranger');assert.equal(el('#buttons').children.map(b=>b.textContent).join('|'),'Talk to Him');
advanceOnboarding('warning');assert.equal(el('#buttons').children.map(b=>b.textContent).join('|'),'Explore');
Game.hp=7;advanceOnboarding('zapped');assert.equal(Game.hp,7);assert.equal(el('#buttons').children.map(b=>b.textContent).join('|'),'Keep Moving');
advanceOnboarding('hotdog');assert.equal(el('#streetArt').dataset.asset,'shop-hotdog');assert.equal(el('#buttons').children.map(b=>b.textContent).join('|'),'Eat Hot Dog');
Game.hp=Game.maxHP;advanceOnboarding('recovered');assert.equal(el('#buttons').children.map(b=>b.textContent).join('|'),'Explore Again');
startOnboardingFight();assert.equal(Game.enemy.maxHP,6);assert.equal(el('#buttons').children.map(b=>b.textContent).join('|'),'Tackle');
Game.enemy.hp=0;winCombat();collectReward();assert.equal(Game.onboardingStep,'complete');assert.equal(Game.aliensThisLevel,1);assert.equal(Game.money,13);
assert.ok(el('#buttons').children.some(b=>b.textContent==='Explore Street'));
assert.ok(!el('#buttons').children.some(b=>/Take the bus|Take the Rapid|Hail a cab/.test(b.textContent)),'Opening transit lottery is retired');

clearCurrentStreet();
assert.equal(Game.level,2);assert.equal(Game.scene,'cab-pickup');
assert.equal(el('#buttons').children.map(b=>b.textContent).join('|'),'Get in Cab');
showDispatch();assert.equal(Game.scene,'dispatch');assert.equal(Game.cabMet,true);
assert.equal(el('#streetArt').dataset.asset,'transit-cab-scared');
assert.ok(el('#buttons').children.some(b=>b.textContent==='Lakeside Ave'));
assert.ok(el('#buttons').children.some(b=>b.textContent==='Erieside Ave'));
assert.equal(clearedStreetNumbers().join(','),'1');

chooseDispatchStreet(5);assert.equal(Game.dispatchSelection,5);assert.equal(streetNumber(),1);assert.equal(dispatchStatus(5),'URGENT');
assert.ok(el('#buttons').children.some(b=>b.textContent==='Go to Lakeside Ave'));
goToDispatchStreet(5);assert.equal(streetNumber(),5);assert.equal(activeStreet(),5);assert.equal(Game.mayorState,'saved');
assert.equal(el('#streetArt').dataset.asset,'street-lakeside');
assert.equal(Game.route[1],5);assert.match(televisionReport(),/City Hall/i);assert.match(newspaperReport(),/CITY HALL HOLDS/);

newGame();Game.onboardingStep='complete';clearCurrentStreet();showDispatch();chooseDispatchStreet(3);goToDispatchStreet(3);
assert.equal(Game.mayorState,'controlled');assert.equal(streetNumber(),3);assert.equal(Game.route[1],3);
Game.streetSeen={};Game.streetDecks={};Game.deckBuilds={};
assert.ok(buildStreetDeck(3).includes('police'),'Controlled police can appear on occupied streets');
assert.match(televisionReport(),/surrender|checkpoint/i);assert.match(newspaperReport(),/CHECKPOINTS/);
Game.scene='directory';startPolice();assert.ok(el('#buttons').children.some(b=>b.textContent==='Break the signal'));

Game.scene='directory';Game.aliensThisLevel=winsRequiredForStreet(Game.level);checkLevelUp();showDispatch();chooseDispatchStreet(5);goToDispatchStreet(5);
Game.aliensThisLevel=winsRequiredForStreet(Game.level);checkLevelUp();assert.equal(Game.mayorState,'rescued');
showDispatch();const safeButton=el('#buttons').children.find(b=>b.textContent==='Euclid Ave');assert.ok(safeButton);assert.equal(safeButton.classList.contains('dispatch-safe'),true);assert.equal(el('#directoryBtn').hidden,true);
chooseDispatchStreet(3);assert.equal(dispatchStatus(3),'SAFE');goToDispatchStreet(3);assert.equal(streetNumber(),3);assert.equal(streetCleared(),true);assert.equal(el('#sceneLocation').children.length,1);assert.equal(el('#directoryLabel').textContent,'HAIL CAB');assert.equal(el('#directoryBtn').hidden,false);el('#directoryBtn').onclick();assert.equal(Game.scene,'dispatch');chooseDispatchStreet(3);goToDispatchStreet(3);startCombat();assert.equal(Game.enemy,null);
assert.match(televisionReport(),/LIBERATED/);assert.match(newspaperReport(),/CITY HALL FREED/);

Game.route=defaultRoute();Game.level=Game.highestDistrict=9;Game.currentStreet=9;Game.scene='directory';showDispatch();
chooseDispatchStreet(10);assert.equal(dispatchStatus(10),'BLOCKADED');assert.ok(!el('#buttons').children.some(b=>b.textContent.startsWith('Go to')));
Game.level=Game.highestDistrict=10;showDispatch();
chooseDispatchStreet(10);assert.ok(el('#buttons').children.some(b=>b.textContent==='Go to Erieside Ave'));
goToDispatchStreet(10);assert.equal(streetNumber(),10);assert.equal(activeStreet(),10);

assert.equal(HIDDEN_FINDS[7][0].id,'franks-key');assert.ok(!HIDDEN_FINDS[10].some(find=>find.id==='franks-key'));
Game.secretsFound=[];offerHidden(HIDDEN_FINDS[7][0]);assert.equal(hasFranksKey(),false);assert.equal(el('#buttons').children.map(b=>b.textContent).join('|'),'Take Key');claimHidden(HIDDEN_FINDS[7][0]);assert.equal(hasFranksKey(),true);

Game.scene='dispatch';Game.currentStreet=9;saveGame();Game.mayorState='pending';continueGame();
assert.equal(Game.scene,'dispatch');assert.equal(Game.mayorState,'rescued');
const stored=JSON.parse(localStorage.getItem(SAVE_KEY));assert.equal(stored.version,2);
newGame();advanceOnboarding('zapped');saveGame();Game.onboardingStep='complete';continueGame();assert.equal(Game.onboardingStep,'zapped');assert.equal(Game.scene,'onboarding');
Game.currentStreet='';Game.level=1;Game.route=defaultRoute();assert.equal(streetNumber(),1);updateCampaignHUD();assert.ok(el('#campaignProgress').textContent.includes('STREET 1/10'));
const invalid=JSON.parse(localStorage.getItem(SAVE_KEY));invalid.state.mayorState='alien';localStorage.setItem(SAVE_KEY,JSON.stringify(invalid));assert.equal(readSave(),null);
`,context);
console.log('PASS: Public Square prologue; cab dispatch; free street order; Lakeside-first and controlled-mayor branches; safe revisits; harbor blockade; pre-harbor key; dispatch saves.');

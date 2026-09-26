/* Artwork selected from game state; street backgrounds are reused in combat. */
window.SceneArt = (() => {
  const streets = {
    ontario: ['street-ontario', 'Terminal Tower above abandoned buses in Public Square.'],
    superior: ['street-superior', 'An abandoned bus blocks a rain-soaked avenue of office buildings.'],
    euclid: ['street-euclid', 'Theater marquees glow along deserted Euclid Avenue.'],
    e9th: ['street-east-9th', 'Stone banks and mirrored offices flank a deserted street.'],
    lakeside: ['street-lakeside', 'Empty civic steps and benches beneath an alien-lit sky.'],
    w6th: ['street-west-6th', 'Steam rises between brick warehouses and loading docks.'],
    oldriver: ['street-old-river', 'Neon reflects on the river beneath a steel lift bridge.'],
    prospect: ['street-prospect', 'A payphone and fire escapes line shadowy brick storefronts.'],
    huron: ['street-huron', 'Stranded taxis sit beneath a rusted railway viaduct.'],
    erieside: ['street-erieside', 'A colossal mothership hangs over the industrial lakefront.']
  };
  const enemies = {
    blue: 'A lean blue alien with a swept-back head and glowing cyan eyes.',
    green: 'A broad-shouldered green alien crouches with hooked claws.',
    grey: 'A slender grey alien watches with enormous dark eyes.',
    red: 'A hunched red alien bares its teeth beneath a spiny crest.'
  };
  const bosses = {
    blue: 'An armored blue alien commander with a towering swept-back crest.',
    green: 'A hulking green alien brute with thick plated shoulders.',
    grey: 'A grey alien overseer with an expanded cranial crest.',
    red: 'A scarred red alien boss with a crown of heavy spines.'
  };
  const businesses = {
    coffee: ['shop-coffee', 'A warm coffee counter with steaming mugs and a donut case.', 'Coffee Shop'],
    pizza: ['shop-pizza', 'Fresh pizza sits beneath the lights of a neighborhood slice counter.', 'Pizza Shop'],
    hotdog: ['shop-hotdog', 'Steam rises from a hot dog cart beneath a worn umbrella.', 'Hot Dog Cart'],
    diner: ['shop-diner', 'A waitress waits beside a chrome diner counter and red vinyl stools.', 'Diner'],
    bar: ['shop-bar', 'A bartender watches over a wooden bar beneath a glowing football broadcast.', 'Bar'],
    deli: ['shop-deli', 'Sandwiches, pickle jars, and a meat slicer fill a neighborhood deli.', 'Deli'],
    convenience: ['shop-convenience', 'Snack shelves and cold drinks line a fluorescent-lit corner store.', 'Convenience Store'],
    chinese: ['shop-chinese', 'Red lanterns glow above a restaurant counter and steaming tea.', 'Chinese Restaurant'],
    thrift: ['shop-thrift', 'Old jackets and mismatched lamps crowd a thrift store.', 'Thrift Store'],
    pawn: ['shop-pawn', 'A pawn broker stands among old electronics and improvised weapons.', 'Pawn Shop'],
    surplus: ['shop-surplus', 'Military rations, field jackets, and footlockers fill an army surplus shop.', 'Army Surplus'],
    drugstore: ['shop-drugstore', 'A pharmacist waits behind a counter of bandages and medicine.', 'Drugstore'],
    arcade: ['shop-arcade', 'Colorful arcade cabinets cast neon light over a patterned carpet.', 'Arcade'],
    camera: ['shop-camera', 'Instant cameras, flash equipment, and film boxes fill a camera shop.', 'Camera Shop'],
    rac: ['shop-radio-shack', 'A red-vested clerk stands among batteries, wires, and portable televisions.', 'Radio Shack'],
    record: ['shop-record', 'Vinyl crates and cassette racks surround a record-store counter.', 'Record Store'],
    church: ['shop-st-stanislaus', 'A priest offers shelter in a candlelit sanctuary.', 'St. Stanislaus'],
    frank: ['shop-captain-franks', 'Fishing nets and empty lobster tanks fill a dark pier restaurant under the mothership.', "Captain Frank's"]
  };
  const storefronts = {
    record: ['storefront-record', 'A neon planet glows above records and cassettes in a rain-streaked Ontario Street window.', 'Record Store'],
    pawn: ['storefront-pawn', 'Barred windows display old televisions, radios, cameras, and tools near Public Square.', 'Pawn Shop'],
    pizza: ['storefront-pizza', 'A striped awning and hot oven glow mark a neighborhood pizza shop on Superior.', 'Pizza Shop'],
    drugstore: ['storefront-drugstore', 'Medicine displays and fluorescent light fill a weathered Superior Avenue storefront.', 'Drugstore'],
    arcade: ['storefront-arcade', 'Blue and magenta arcade cabinets shine beside the Euclid theater marquees.', 'Arcade'],
    rac: ['storefront-radio-shack', 'Portable radios and televisions glow behind the windows of an East 9th electronics shop.', 'Radio Shack'],
    surplus: ['storefront-surplus', 'Field jackets, steel helmets, and footlockers line barred windows beside the Cuyahoga.', 'Army Surplus'],
    church: ['storefront-st-stanislaus', 'Open church doors cast warm candlelight onto rain-soaked Prospect Avenue.', 'St. Stanislaus'],
    hotdog: ['storefront-hotdog', 'Steam rises from a red-and-yellow hot dog cart beneath the Huron viaduct.', 'Hot Dog Cart'],
    frank: ['storefront-captain-franks', 'Captain Frank\'s sits chained and storm-battered beneath the mothership on the Erieside pier.', "Captain Frank's"]
  };
  const encounters = {
    tv: ['encounter-tv', 'An old shop-window television carries emergency invasion coverage.', 'Emergency Broadcast', 'LIVE COVERAGE'],
    newspaper: ['encounter-newspaper', 'Rain beads on a newspaper box holding an invasion front page.', 'News Stand', 'LATEST EDITION'],
    'onboarding-zap': ['encounter-onboarding-zap', 'A blue alien leaves you wounded in the rain beneath Terminal Tower.', 'Public Square', 'LEFT FOR DEAD'],
    'mayor-controlled': ['encounter-mayor-controlled', 'A shop-window television carries the mayor\'s alien-controlled emergency address.', 'Emergency Broadcast', 'SIGNAL COMPROMISED'],
    'franks-key': ['encounter-franks-key', 'A brass seafood-house key rests inside the bridge tender\'s cabinet.', 'Hidden Cache', 'HARBOR KEY FOUND'],
    survivor: ['encounter-survivor', 'A frightened local shelters in a shadowy doorway.', 'Survivor', 'YOU ARE NOT ALONE'],
    'survivor-ontario': ['encounter-bystander-ontario', 'A battered local gestures urgently beneath the lights of Public Square.', 'Public Square Survivor', 'STREET WITNESS'],
    'survivor-superior': ['encounter-bystander-superior', 'A stranded bus driver guards frightened passengers beside an alien-scorched tire.', 'Bus Driver', 'TRANSIT STRANDED'],
    'survivor-lakeside': ['encounter-bystander-lakeside', 'A City Hall employee clutches a radio and files on the storm-lashed civic plaza.', 'City Hall Staffer', 'CIVIC SIGNAL'],
    'survivor-west-6th': ['encounter-bystander-west-6th', 'A dockworker raises an emergency flare between the warehouse loading bays.', 'Dockworker', 'FLARE SIGNAL'],
    'survivor-old-river': ['encounter-bystander-old-river', 'The bridge tender works the lift controls while the invasion burns above the river.', 'Bridge Tender', 'RIVER WATCH'],
    'survivor-prospect': ['encounter-bystander-prospect', 'A shelter volunteer offers blankets outside a church on rain-soaked Prospect.', 'Shelter Volunteer', 'DOOR STILL OPEN'],
    'survivor-erieside': ['encounter-bystander-erieside', 'A harbormaster radios a warning beneath the mothership at the Lake Erie docks.', 'Harbormaster', 'HARBOR BLOCKADE'],
    police: ['encounter-police', 'A weary officer stands beside a patrol car and barricade.', 'Police Officer', 'EMERGENCY RESPONSE'],
    'care-package': ['encounter-care-package', 'An open military supply crate rests beneath a weathered tarp.', 'Care Package', 'SUPPLIES FOUND'],
    'bus-zapped': ['transit-bus-zapped', 'An alien energy blast blows a city bus tire as frightened passengers brace inside.', 'City Bus', 'TIRE DESTROYED'],
    'rapid-running': ['transit-rapid-running', 'A 1989 Cleveland Rapid train carries wary passengers toward Public Square.', 'The Rapid', 'TRAIN MOVING'],
    'rapid-stalled': ['transit-rapid-stalled', 'A stalled Rapid train sits aligned in the rain-soaked trench while staff inspect it.', 'The Rapid', 'TRAIN STOPPED'],
    'cab-scared': ['transit-cab-scared', 'A frightened cab driver hears the invasion warning over his dashboard radio.', 'Cleveland Cab', 'RADIO WARNING'],
    'cab-secure': ['transit-cab-secure', 'The cab driver calmly works the dispatch radio while police guide civilians through the rain.', 'Cleveland Cab', 'CITY HALL SECURE'],
    'cab-singing': ['transit-cab-singing', 'A singing cab driver misses the emergency bulletin as saucers glow outside.', 'Cleveland Cab', 'RADIO MISSED']
  };
  function setImage(img, asset, alt, responsive = true) {
    if (!img) return;
    img.alt = alt;
    if (img.dataset.asset === asset) return;
    img.dataset.asset = asset;
    img.hidden = true;
    img.onload = () => { img.hidden = false; };
    img.onerror = () => { img.hidden = true; };
    img.srcset = responsive
      ? `images/art/${asset}-small.webp 640w, images/art/${asset}.webp 1280w` : '';
    img.sizes = '(max-width: 640px) 100vw, 860px';
    img.src = `images/art/${asset}.webp`;
  }
  function render({street, level, enemy = null, scene = 'explore', business = null, storefront = null, encounter = null}) {
    const stage = document.getElementById('sceneArt');
    if (!stage) return;
    const fighting = scene === 'combat' && !!enemy;
    const finale = fighting && !!enemy.isFinalBoss ? businesses.frank : null;
    const shop = scene === 'business' && Object.hasOwn(businesses, business) ? businesses[business] : null;
    const exterior = scene === 'business' && Object.hasOwn(storefronts, storefront) ? storefronts[storefront] : null;
    const event = ['intro', 'npc', 'empty', 'dispatch', 'onboarding'].includes(scene) && Object.hasOwn(encounters, encounter) ? encounters[encounter] : null;
    const data = finale || shop || exterior || event || streets[street.id] || streets.ontario;
    setImage(document.getElementById('streetArt'), data[0], data[1]);
    const loc = document.getElementById('sceneLocation');
    loc.innerHTML = '';
    const label = data[2] || street.name;
    const current = document.createElement('span');
    current.textContent = label;
    loc.appendChild(current);
    document.getElementById('sceneChapter').textContent = `CLEVELAND · 1989 / STREET ${String(level).padStart(2, '0')}`;
    const color = enemy?.color || enemy?.name?.toLowerCase().replace('boss ', '');
    const hasSprite = fighting && Object.hasOwn(enemies, color);
    const actor = document.getElementById('enemyActor');
    actor.hidden = !hasSprite;
    stage.classList.toggle('is-combat', fighting);
    stage.classList.toggle('is-interior', !!shop || !!finale);
    stage.classList.toggle('is-conversation', !!event && (encounter?.startsWith('survivor') || encounter === 'police'));
    stage.classList.toggle('is-boss', hasSprite && !!enemy.isBoss);
    stage.classList.toggle('is-defeated', hasSprite && enemy.hp <= 0);
    if (hasSprite) setImage(document.getElementById('enemyArt'), `${enemy.isBoss ? 'boss' : 'alien'}-${color}`,
      enemy.isBoss ? bosses[color] : enemies[color], false);
    const badge = document.getElementById('sceneStatus');
    badge.textContent = fighting
      ? (enemy.hp <= 0 ? 'THREAT NEUTRALIZED' : `${enemy.isBoss ? 'BOSS · ' : ''}${color.toUpperCase()} ALIEN`)
      : (shop ? 'SHELTER & SUPPLIES' : exterior ? 'STOREFRONT / ENTER OR MOVE ON' : event ? event[3] : 'CLEVELAND UNDER SIEGE');
  }
  function ending(kind) {
    setImage(document.getElementById('endingArt'), `ending-${kind}`,
      kind === 'victory' ? 'Neighbors emerge at dawn as the mothership retreats over the lake.'
        : 'A discarded bat and leather jacket lie beneath alien searchlights.');
  }
  return {render, ending, streets, enemies, bosses, businesses, storefronts, encounters};
})();

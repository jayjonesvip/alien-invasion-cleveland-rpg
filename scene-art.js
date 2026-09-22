/* Phase 1 artwork. One street image is reused for exploration and combat. */
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
  function render({street, level, enemy = null, scene = 'explore'}) {
    const stage = document.getElementById('sceneArt');
    if (!stage) return;
    const data = streets[street.id] || streets.ontario;
    setImage(document.getElementById('streetArt'), data[0], data[1]);
    document.getElementById('sceneLocation').textContent = street.name;
    document.getElementById('sceneChapter').textContent = `CLEVELAND · 1989 / STREET ${String(level).padStart(2, '0')}`;
    const fighting = scene === 'combat' && !!enemy;
    const color = enemy?.color || enemy?.name?.toLowerCase().replace('boss ', '');
    const hasSprite = fighting && Object.hasOwn(enemies, color);
    const actor = document.getElementById('enemyActor');
    actor.hidden = !hasSprite;
    stage.classList.toggle('is-combat', fighting);
    stage.classList.toggle('is-boss', hasSprite && !!enemy.isBoss);
    stage.classList.toggle('is-defeated', hasSprite && enemy.hp <= 0);
    if (hasSprite) setImage(document.getElementById('enemyArt'), `alien-${color}`, enemies[color], false);
    const badge = document.getElementById('sceneStatus');
    badge.textContent = fighting
      ? (enemy.hp <= 0 ? 'THREAT NEUTRALIZED' : `${enemy.isBoss ? 'BOSS · ' : ''}${color.toUpperCase()} ALIEN`)
      : (scene === 'business' ? 'SHELTER & SUPPLIES' : 'CLEVELAND UNDER SIEGE');
  }
  function ending(kind) {
    setImage(document.getElementById('endingArt'), `ending-${kind}`,
      kind === 'victory' ? 'Neighbors emerge at dawn as the mothership retreats over the lake.'
        : 'A discarded bat and leather jacket lie beneath alien searchlights.');
  }
  return {render, ending, streets, enemies};
})();

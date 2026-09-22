# Lake Effect Invasion

*Cleveland, 1989. Fight. Eat. Fight again.*

A browser text adventure game set in 1989 Cleveland during an alien invasion, with illustrated streets and alien encounters.

## Play the Game

[Play Online](https://lakeeffectinvasion.com/)

[How to Play](https://lakeeffectinvasion.com/how-to-play.html) explains combat, shopping, saving, and how to return to the City Directory after encounters. Open it from the title screen or in-game controls without leaving your game tab.

Or download the repository ZIP, extract it, and open `index.html` in a modern web browser. Keep the HTML, CSS, JavaScript, and images together. No installation or build step is needed.

[Preview the artwork](https://lakeeffectinvasion.com/gallery.html)

## Features

- Turn-based combat with purchasable martial-arts VHS moves, guarding, and counterattacks
- A local directory for each street, with landmarks, local shops, and visible item effects
- Food that heals now and grants a permanent first-taste upgrade for the current run
- A 30-victory campaign with ten district bosses and a playable lakefront finale
- Automatic local checkpoints, Continue, and shelter recovery after defeat
- Business loyalty card system
- Armor and equipment mechanics
- 10 levels across iconic Cleveland streets
- Neon and paper themes inspired by 1980s emergency broadcasts
- Cinematic title screen, survival dashboard, segmented health meters, and keyboard-accessible theme control
- Mobile-friendly responsive design
- Typewriter text effects with customizable settings
- 42 illustrations: ten streets, seventeen businesses, four aliens, four distinct bosses, five encounters, and two endings
- Responsive scene artwork that follows shopping, conversations, supply discoveries, and combat
- A separate interactive art gallery for previewing every scene and enemy

## Gameplay

You're an ordinary person caught in an alien invasion of Cleveland. Fight your way through downtown streets, from Public Square to the lakefront, gathering strength and allies as you push back the invasion.

- **Fight:** Explore to find aliens at level 1. At level 2, Hunt an Alien unlocks with a 2.5-second search meter before combat. Use punch, kick, tackle, and purchased moves. Read each alien's combat hint; guard halves incoming damage, and Counterattack training lets you hit back.
- **Shop:** Open CITY DIRECTORY between fights. Visit the Ontario Record Store for basic training; find advanced moves at later local shops. Try new foods for lasting stat upgrades, and collect business loyalty rewards.
- **Grow:** Win two patrol fights and a boss fight per district. Advance through ten districts, ending with the Mothership Commander. Level-ups increase your health and heal you fully.
- **Travel:** Clear a street to open the next road, then choose Walk onward. Walk back one street at a time; cleared streets are safe and your campaign progress stays intact.
- **Equip:** Buy armor and three-swing weapons. Walk back through cleared streets to revisit earlier shops.
- **Continue:** Progress saves after completed actions. Defeat lets you recover at a shelter with full health and intact upgrades, losing 25% of your cash, rounded up.

## Technical Details

- Pure HTML/CSS/JavaScript
- No external dependencies required for gameplay; live-site analytics uses Google Analytics
- Saves the campaign, theme, and text settings to localStorage in the current browser
- Works offline

## Development

The core game logic and UI markup live in `index.html`; `campaign.js` adds shopping-driven progression, the directory, training, and versioned checkpoints. Artwork selection and layout live in `scene-art.js` and `scene-art.css`, with optimized WebP assets under `images/art/`. `retro-skin.css` provides the 1989 broadcast styling with system fonts and CSS effects, so the design works offline. `gallery.html` previews the art library. Everything runs directly in the browser and can be served as a static site. New players start in the neon theme; saved theme preferences are preserved.

Campaign saves belong to this browser and site address; they do not sync across devices or between localhost and the live site. Clearing browser data removes them. Start New Run replaces the saved campaign after confirmation. If browser storage is unavailable, the game displays a warning and remains playable in the open tab.

Run the dependency-free integration checks with:

```sh
node tests/campaign.cjs
node tests/streets.cjs
node tests/hunt.cjs
node tests/tutorial.cjs
node tests/analytics.cjs
node tests/balance.cjs
```

The campaign suite includes the artwork integration checks. The balance script runs 50 seeded campaigns with an automated shopper; it is a completion smoke test, not a substitute for human playtesting.

See [campaign notes](docs/CAMPAIGN.md) for mechanics and checkpoint behavior, and [artwork notes](docs/ARTWORK.md) for asset scope and generation prompts.

Search metadata, canonical links, and the three-page [sitemap](https://lakeeffectinvasion.com/sitemap.xml) use lakeeffectinvasion.com. See [SEO notes](docs/SEO.md) for maintenance and verification.

Google Analytics uses the supplied GA4 property on the live domain. See [analytics notes](docs/ANALYTICS.md) for events, parameter definitions, and reporting setup. Local/offline play does not send analytics.

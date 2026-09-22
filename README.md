# Alien Invasion Cleveland RPG

A browser text adventure game set in 1989 Cleveland during an alien invasion, with illustrated streets and alien encounters.

## Play the Game

[Play Online](https://jayjonesvip.github.io/alien-invasion-cleveland-rpg/)

Or download the repository ZIP, extract it, and open `index.html` in a modern web browser. Keep the HTML, CSS, JavaScript, and images together. No installation or build step is needed.

[Preview the artwork](https://jayjonesvip.github.io/alien-invasion-cleveland-rpg/gallery.html)

## Features

- Turn-based combat with multiple abilities
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

- **Combat:** Use punch, kick, tackle, and unlockable special moves
- **Businesses:** Visit coffee shops, diners, and bars to heal and earn loyalty cards
- **Progression:** Level up to unlock new abilities and increase your health
- **Equipment:** Find armor and temporary weapons to aid in combat

## Technical Details

- Pure HTML/CSS/JavaScript
- No external dependencies
- Saves theme and text settings to localStorage
- Works offline

## Development

The game logic and UI markup live in `index.html`. Artwork selection and layout live in `scene-art.js` and `scene-art.css`, with optimized WebP assets under `images/art/`. `retro-skin.css` provides the 1989 broadcast styling with system fonts and CSS effects, so the design works offline. `gallery.html` previews the art library. Everything runs directly in the browser and can be served as a static site. New players start in the neon theme; saved theme preferences are preserved.

Run the dependency-free integration checks with:

```sh
node tests/art-integration.cjs
```

See [artwork notes](docs/ARTWORK.md) for asset scope, generation prompts, and validation details.

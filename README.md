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
- Dark/light theme toggle
- Mobile-friendly responsive design
- Typewriter text effects with customizable settings
- Ten illustrated street environments, four transparent alien sprites, and two ending illustrations
- Responsive scene artwork with boss treatments and a separate interactive art gallery

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

The game logic and original UI live in `index.html`. Artwork selection and layout live in `scene-art.js` and `scene-art.css`, with optimized WebP assets under `images/art/`. `gallery.html` previews the art library. Everything runs directly in the browser and can be served as a static site.

Run the dependency-free integration checks with:

```sh
node tests/art-integration.cjs
```

See [artwork notes](docs/ARTWORK.md) for asset scope, generation prompts, and validation details.

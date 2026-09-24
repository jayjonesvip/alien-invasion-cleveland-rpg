# Artwork

The game now includes 42 illustrations in addition to the original splash:

| Artwork | Count | Appears when |
| --- | ---: | --- |
| Cleveland streets | 10 | Exploring, fighting, and reaching the finale |
| Business interiors and vendors | 17 | Entering each business; remains visible during purchases |
| Regular alien sprites | 4 | Fighting blue, green, grey, and red aliens |
| Dedicated boss sprites | 4 | Fighting each color's boss variant |
| Encounter scenes | 5 | Watching TV, reading a newspaper, meeting a survivor or police officer, and finding a care package |
| Endings | 2 | Victory and defeat |

All artwork was generated with the built-in OpenAI imagegen tool. [First-release prompts and revisions](art-prompts.json) document the original 16 images; [second-release prompts and revisions](art-prompts-phase2.json) document the next 26; [the Captain Frank's prompt](art-prompts-phase3.json) documents the final-boss restaurant interior. The four bosses were generated using their corresponding regular alien as a visual reference.

The game ships 48 full-size WebP illustrations and 40 smaller exports for narrow viewports. All eight alien and boss sprites retain real transparency. Art is requested as scenes change rather than loading the entire collection at startup. No third-party image service is needed at runtime.

`SceneArt.render()` selects artwork from game state. Approaching a business retains the current street; entering switches to its interior. Leaving, ignoring an encounter, and starting a new game clear the relevant artwork state. Rations and vest discoveries share the care-package illustration. Bosses use their own sprite and a distinct badge. Interior and conversation framing keeps faces visible in the game banner.

The interactive gallery previews every street, business, and encounter, plus regular alien and boss combinations on each street. Gallery thumbnails also show both endings.

The environments are illustrated interpretations of the game's 1989 setting, not verified historical reconstructions. Modern museum architecture identified in the Lakeside and care-package drafts was replaced in their final revisions.

## Gameplay scope

The original artwork releases preserved game balance. The subsequent [campaign update](CAMPAIGN.md) adds shopping-driven upgrades, thirty required victories, and a playable Erieside chapter ending with the Mothership Commander. Victory now requires defeating that final boss. The existing red boss illustration represents the Commander. Victory and defeat retain terminal scenes for correct artwork cleanup.

## Validation

Run `node tests/art-integration.cjs` from the repository root. Its lightweight DOM stub executes the actual game and artwork scripts and checks:

- Ten street mappings and all eight regular/boss sprites.
- Entry, purchase, and exit for all seventeen businesses.
- All five encounter illustrations, conversation continuity, and both care-package rewards.
- Fleeing, level-up, victory, defeat, restart, and all 76 optimized asset paths.

Browser checks cover representative shops, purchases and exits, conversations, supplies, transparent boss compositing, and desktop, phone portrait, and short landscape layouts. Source images were checked for successful decoding and sprite transparency. These checks do not constitute a full campaign playthrough.

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

All artwork was generated with the built-in OpenAI imagegen tool. [First-release prompts and revisions](art-prompts.json) document the original 16 images; [second-release prompts and revisions](art-prompts-phase2.json) document the additional 26. The four bosses were generated using their corresponding regular alien as a visual reference.

The 42 full-size WebP exports total 7,615,732 bytes, approximately 7.6 MB. Thirty-four smaller exports serve narrow viewports, and all eight alien and boss sprites retain real transparency. Art is requested as scenes change rather than loading the entire collection at startup. No third-party image service is needed at runtime.

`SceneArt.render()` selects artwork from game state. Approaching a business retains the current street; entering switches to its interior. Leaving, ignoring an encounter, and starting a new game clear the relevant artwork state. Rations and vest discoveries share the care-package illustration. Bosses use their own sprite and a distinct badge. Interior and conversation framing keeps faces visible in the game banner.

The interactive gallery previews every street, business, and encounter, plus regular alien and boss combinations on each street. Gallery thumbnails also show both endings.

The environments are illustrated interpretations of the game's 1989 setting, not verified historical reconstructions. Modern museum architecture identified in the Lakeside and care-package drafts was replaced in their final revisions.

## Gameplay scope

Game balance is unchanged. Victory still triggers on reaching level 10; Erieside appears as the finale backdrop. These artwork releases do not add a playable final chapter. The first release also made victory and defeat retain terminal scenes for correct artwork cleanup.

## Validation

Run `node tests/art-integration.cjs` from the repository root. Its lightweight DOM stub executes the actual game and artwork scripts and checks:

- Ten street mappings and all eight regular/boss sprites.
- Entry, purchase, and exit for all seventeen businesses.
- All five encounter illustrations, conversation continuity, and both care-package rewards.
- Fleeing, level-up, victory, defeat, restart, and all 76 optimized asset paths.

Browser checks cover representative shops, purchases and exits, conversations, supplies, transparent boss compositing, and desktop, phone portrait, and short landscape layouts. Source images were checked for successful decoding and sprite transparency. These checks do not constitute a full campaign playthrough.

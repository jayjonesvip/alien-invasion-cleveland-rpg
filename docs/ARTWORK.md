# First artwork release

This release integrates 16 illustrations: ten Cleveland street environments, four alien sprites, and victory/defeat scenes. It retains the original splash. All new artwork was generated with the built-in OpenAI imagegen tool; [prompts and revisions](art-prompts.json) document the generation process.

The 16 full-size WebP exports total 2,948,818 bytes, approximately 2.95 MB. Twelve smaller exports serve narrow viewports. All four alien sprites retain real transparency. Art is requested as scenes change rather than loading the entire collection at startup.

`SceneArt.render()` maps the current street and enemy to images. Bosses currently use larger regular sprites with a badge; dedicated boss art, business interiors, and conversation art are planned for a later release. The gallery allows street/enemy combinations to be inspected without playing through the campaign.

The environments are illustrated interpretations of the game's 1989 setting, not verified historical reconstructions. A modern museum in the first Lakeside draft was removed in the final revision.

## Gameplay scope

Game balance is unchanged. Victory still triggers on reaching level 10; Erieside appears as the finale backdrop. This release does not add a playable final chapter. Victory now retains a terminal scene instead of restoring an Explore button beneath the overlay, and defeat also records a terminal scene for artwork cleanup.

## Validation

`node tests/art-integration.cjs` uses a lightweight DOM stub to exercise actual game and artwork scripts. It checks street and enemy mappings, boss styling, fleeing, level-up, victory, defeat, restart, and asset paths. It does not replace browser layout testing.

The release was also checked in the browser for opening gameplay, one full combat round, fleeing, transparent compositing, desktop, phone portrait, and short landscape layouts. Source images were checked for successful decoding and sprite transparency. No full campaign playthrough was performed.

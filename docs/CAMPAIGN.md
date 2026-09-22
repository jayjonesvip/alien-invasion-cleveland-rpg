# Fight, shop, grow

The campaign uses the existing 1989 Cleveland setting and artwork. Start with 50 HP and $8. Each street has its own directory with a landmark, local businesses, and adjacent travel options. Campaign level tracks the active district; currentStreet tracks the street being visited. Cleared streets never offer battles.

## Progression and money

Patrol / Fight is locked until level 2, including direct boss challenges. On the first street, players find all three battles through Explore / Encounters; the third battle is its boss. Collecting that boss bounty reaches level 2 and unlocks direct fights on the next active street. Exploration remains available afterward.

Each of ten districts requires two regular victories and one boss victory. Reaching district ten begins the final chapter; its third victory defeats the Mothership Commander and ends the thirty-win campaign. Fleeing and losing do not advance the counter. Advancing a district grants +10 maximum HP and a full heal.

Regular bounties are $4 plus district number; bosses add $6. Rewards are independent of combat duration and are collected once. Existing encounter cash and loyalty rewards remain available.

## Shopping and builds

Training is distributed across local businesses:

| Training | Price | Where | Effect |
| --- | ---: | --- | --- |
| Grappling VHS | $18 | Ontario Record Store | Reliable, repeatable Throw Enemy |
| Lake Effect Kick VHS | $24 | Euclid Arcade | Powerful kick, once per fight |
| Ironworks Punch VHS | $28 | West 6th Bar | Powerful punch, once per fight |
| Spinning Kick VHS | $32 | Lakeside Chinese Restaurant | Strong, repeatable kick |
| Counterattack VHS | $20 | Ontario Record Store | Return damage after guarding a hit |

Conditioning levels cost $12, $24, and $36 at the Ontario Record Store, Euclid Arcade, and Old River Army Surplus respectively, each adding one defense. They require the previous level and cannot be repurchased. Moves are purchased instead of automatically learned at a level threshold.

Each eligible food or drink gives a first-taste bonus once per shop/item in the current run: punch +1, kick +1, accuracy +1 percentage point, or maximum HP +2. Its menu describes the effect before purchase. Further purchases still heal but do not repeat the permanent bonus. Bandages and lottery tickets do not grant food bonuses. Training and food upgrades survive defeat and reload; a new run resets them.

Weapons last three swings, including misses, and carry remaining uses between fights. Armor still has hit durability. All seventeen businesses have fixed street locations. Earlier businesses can be reached by backtracking; they are not listed in a remote directory.

## Combat and recovery

Blue aliens favor accurate attacks, green aliens hit harder with lower accuracy, grey aliens ignore worn armor, and red aliens gain damage over successive rounds. Conditioning still reduces grey damage. Guard halves incoming damage; learned Counterattack returns damage after a hit is blocked. The HUD explains the current enemy's behavior.

Defeat offers shelter recovery: full health, upgrades and district victories retained, temporary buffs cleared, and 25% of current cash lost, rounded up. Recovery is free at $0.

## Checkpoints

`alienRPGCampaignV1` retains its original key and now stores a version-2 localStorage checkpoint after completed actions. A turn in progress is not saved halfway through: reloading resumes the last completed checkpoint. Purchases, health, money, upgrades, armor, weapon charges, district progress, and combat state are retained. A defeated enemy with an uncollected bounty resumes at Collect without rerolling the reward. Version-1 saves migrate to the active street and retain money, upgrades, and purchased moves, including advanced moves bought before shops were redistributed. Version-2 saves retain the visited street separately from the active district. Outside combat, Continue opens the current street directory; it does not replay the exact previous shop or NPC dialogue.

Invalid or unsupported saves are ignored. Storage failures leave the game running and display a warning. Saves are local to the browser and origin; there is no account or cloud sync. Starting a new run asks before replacing a valid save.

## Validation

`node tests/campaign.cjs` executes the game in a lightweight DOM harness. It includes artwork integration checks and covers training prerequisites, first-taste bonuses, weapon charges, fixed rewards, duplicate collection, save/resume, pending loot, shelter recovery, atomic turn saves, guard/counter, alien behaviors, all thirty victories, final-boss gating, reset, and malformed/unavailable storage.

`node tests/streets.cjs` covers local shop restrictions, adjacent travel, road unlocks without teleporting, safe backtracking, active progress preservation, redistributed training, save migration, and streets with one or zero shops.

`node tests/balance.cjs` simulates fifty seeded campaigns using actual combat functions and a simple automated shopper that walks between streets and visits the nearest affordable healing shop. Completion is required for every seed. This checks for progression dead ends; its purchasing strategy and knowledge of expected damage are not representative of every human player.

Browser checks cover buying and using a move, food upgrades, reload/Continue during combat, the final victory and shelter flows, and desktop, phone portrait, and short landscape layouts. Final encounter and recovery checks use local-only scenario fixtures. A full human campaign playthrough remains the next balance check.


## Street route

Defeating a boss unlocks the next street but leaves the player in place. Walking costs no money and grants no healing; it shows a short arrival scene and the local directory. Only adjacent unlocked streets can be reached. No travel or shopping is available during combat. Cleared-street exploration excludes combat and dangerous empty-street events. The route is a fictional campaign path, not a geographically exact walking map.

| Street | Local businesses | Landmark |
| --- | --- | --- |
| Ontario / Public Square | Coffee Shop, Pawn Shop, Record Store | Terminal Tower |
| Superior | Pizza Shop, Thrift Store, Drugstore | Bus blockade |
| Euclid | Diner, Arcade | Theater marquees |
| East 9th | Radio Shack, Camera Shop | Bank towers |
| Lakeside | Chinese Restaurant, Deli | Civic plaza |
| West 6th | Convenience Store, Bar | Warehouse loading docks |
| Old River | Army Surplus | Lift bridge |
| Prospect | St. Stanislaus | Neighborhood sanctuary |
| Huron | Hot Dog Cart | Railway viaduct |
| Erieside | No shops; stock up before arrival | Lake Erie harbor |

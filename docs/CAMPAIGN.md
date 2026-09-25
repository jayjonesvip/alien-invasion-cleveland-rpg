# Fight, shop, clear the city

The campaign uses the existing 1989 Cleveland setting and artwork. Start with 50 HP and $8 in Public Square, shown as Level 0. After clearing the square, a cab driver who witnessed the fight offers rides for the rest of the campaign. His dispatcher reports alien activity, and the player chooses the next occupied street. Campaign level tracks cleared districts; currentStreet tracks the street being visited. Cleared streets are marked SAFE and never offer battles.

## Progression and money

Hunt an Alien is available from level 1. Every street offers two regular fights, followed by a direct district boss challenge. Exploration can also lead to these encounters. Hunt an Alien fills a search meter over 2.5 seconds, locking other actions until the encounter starts. Boss challenges start directly. Reloading during a hunt resumes the last completed checkpoint.

Each of ten districts requires two regular victories and one boss victory. Public Square is always first. Streets two through nine may be cleared in any order through dispatch. Erieside remains blockaded until every other street is safe. The player must find Captain Frank's Key on Old River Road, defeat two pier guards, and enter the restaurant for the Mothership Commander fight. That victory ends the thirty-win campaign. Fleeing and losing do not advance the counter. Advancing a district grants +10 maximum HP and a full heal.

Lakeside is the urgent strategic choice. Choosing it first after Public Square saves the mayor and keeps police crews friendly. Choosing any other street first allows the aliens to control the mayor; police encounters become hostile and television, newspaper, radio, and dispatch reports become bleaker. Clearing Lakeside later rescues the mayor, but does not erase the earlier consequences.

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

`node tests/streets.cjs` covers the Public Square prologue, cab dispatch, free street order, the Lakeside choice and media variants, safe revisits, Erieside's blockade, local shop restrictions, active progress preservation, redistributed training, save migration, and streets with one or zero shops.

`node tests/balance.cjs` simulates fifty seeded campaigns using actual combat functions and a simple automated shopper that walks between streets and visits the nearest affordable healing shop. Completion is required for every seed. This checks for progression dead ends; its purchasing strategy and knowledge of expected damage are not representative of every human player.

Browser checks cover buying and using a move, food upgrades, reload/Continue during combat, the final victory and shelter flows, and desktop, phone portrait, and short landscape layouts. Final encounter and recovery checks use local-only scenario fixtures. A full human campaign playthrough remains the next balance check.


## Cab dispatch

Defeating the Public Square boss introduces the driver and opens dispatch. After each later boss, dispatch returns with updated alien counts. The cab is free and grants no healing. The player may choose any occupied street, revisit any SAFE street for its businesses, or return to the current directory. No travel or shopping is available during combat. Cleared-street exploration excludes combat and dangerous empty-street events. The street network is a fictional campaign structure, not a geographically exact map.

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
| Erieside | Captain Frank's is the ambush, not a store. Blockaded until the other nine streets are safe | East 9th Street Pier |


## Combat and difficulty ramp

All fights use normal move accuracy from the start; there is no opening tutorial or free guaranteed Tackle. Older checkpoints still load, and retired tutorial flags are discarded.

Street one retains its previous health and damage ranges. Each subsequent street adds 2.5% of base enemy health to the existing level progression (22.5% extra on street ten). Enemies gain one extra damage per hit on streets four, seven, and ten. The final commander has 147 HP; hit chances, bounties, and shop prices are unchanged. Already-saved enemies retain their existing HP.

`node tests/combat.cjs` checks normal opening accuracy, paid accuracy buffs, older checkpoints, and the street difficulty ramp.

The action menu expands to fit all its buttons instead of scrolling independently. On screens too short for a full shop menu, the game panel scrolls so all items and Leave remain reachable.

Settings opens a native modal from the top bar, with How to Play (question-mark icon), theme, and text preferences. Close, Escape, or the backdrop dismiss it and return focus to Settings. The map button at the bottom left of the scene opens the local directory; its existing combat and text locks still apply. No controls strip remains above the action menu.

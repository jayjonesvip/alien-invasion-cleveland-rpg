# Fight, shop, grow

The campaign uses the existing 1989 Cleveland setting and artwork. Start with 50 HP and $8. The city directory offers a fight, random exploration, and every shop unlocked so far. Shopping never moves the player backward to weaker enemies.

## Progression and money

Each of ten districts requires two regular victories and one boss victory. Reaching district ten begins the final chapter; its third victory defeats the Mothership Commander and ends the thirty-win campaign. Fleeing and losing do not advance the counter. Advancing a district grants +10 maximum HP and a full heal.

Regular bounties are $4 plus district number; bosses add $6. Rewards are independent of combat duration and are collected once. Existing encounter cash and loyalty rewards remain available.

## Shopping and builds

The Record Store sells five training tapes, available from the first district:

| Training | Price | Effect |
| --- | ---: | --- |
| Grappling VHS | $18 | Reliable, repeatable Throw Enemy |
| Lake Effect Kick VHS | $24 | Powerful kick, once per fight |
| Ironworks Punch VHS | $28 | Powerful punch, once per fight |
| Spinning Kick VHS | $32 | Strong, repeatable kick |
| Counterattack VHS | $20 | Return damage after guarding a hit |

Conditioning levels cost $12, $24, and $36, each adding one defense. They require the previous level and cannot be repurchased. Moves are purchased instead of automatically learned at a level threshold.

Each eligible food or drink gives a first-taste bonus once per shop/item in the current run: punch +1, kick +1, accuracy +1 percentage point, or maximum HP +2. Its menu describes the effect before purchase. Further purchases still heal but do not repeat the permanent bonus. Bandages and lottery tickets do not grant food bonuses. Training and food upgrades survive defeat and reload; a new run resets them.

Weapons last three swings, including misses, and carry remaining uses between fights. Armor still has hit durability. All seventeen businesses unlock along the route, and earlier businesses stay accessible.

## Combat and recovery

Blue aliens favor accurate attacks, green aliens hit harder with lower accuracy, grey aliens ignore worn armor, and red aliens gain damage over successive rounds. Conditioning still reduces grey damage. Guard halves incoming damage; learned Counterattack returns damage after a hit is blocked. The HUD explains the current enemy's behavior.

Defeat offers shelter recovery: full health, upgrades and district victories retained, temporary buffs cleared, and 25% of current cash lost, rounded up. Recovery is free at $0.

## Checkpoints

`alienRPGCampaignV1` stores a versioned localStorage checkpoint after completed actions. A turn in progress is not saved halfway through: reloading resumes the last completed checkpoint. Purchases, health, money, upgrades, armor, weapon charges, district progress, and combat state are retained. A defeated enemy with an uncollected bounty resumes at Collect without rerolling the reward. Outside combat, Continue opens the city directory; it does not replay the exact previous shop or NPC dialogue.

Invalid or unsupported saves are ignored. Storage failures leave the game running and display a warning. Saves are local to the browser and origin; there is no account or cloud sync. Starting a new run asks before replacing a valid save.

## Validation

`node tests/campaign.cjs` executes the game in a lightweight DOM harness. It includes artwork integration checks and covers training prerequisites, first-taste bonuses, weapon charges, fixed rewards, duplicate collection, save/resume, pending loot, shelter recovery, atomic turn saves, guard/counter, alien behaviors, all thirty victories, final-boss gating, reset, and malformed/unavailable storage.

`node tests/balance.cjs` simulates fifty seeded campaigns using actual combat functions and a simple automated shopper. Completion is required for every seed. This checks for progression dead ends; its purchasing strategy and knowledge of expected damage are not representative of every human player.

Browser checks cover buying and using a move, food upgrades, reload/Continue during combat, the final victory and shelter flows, and desktop, phone portrait, and short landscape layouts. Final encounter and recovery checks use local-only scenario fixtures. A full human campaign playthrough remains the next balance check.

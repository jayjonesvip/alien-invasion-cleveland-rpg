# Gameplay analytics

`analytics.js` loads the supplied Google tag, measurement ID `G-W7H8DZ7F3R`, on lakeeffectinvasion.com and www.lakeeffectinvasion.com. It runs on the game, How to Play, and gallery. GA4 handles page views through its normal config call. Localhost, preview domains, and file/offline copies do not load Google or send events. Gameplay continues if analytics is blocked.

Gameplay events carry `level` (campaign frontier) and `street` (physical location). Only game-defined categories and numeric counters are added: no player names, save contents, or custom user identifiers. Google's tag handles its standard browser/session measurement.

| Event | When it fires | Extra parameters |
| --- | --- | --- |
| `new_game` | A new run actually starts; canceled confirmation does not count | — |
| `game_resume` | Continue loads a valid save | `saved_scene` |
| `fight_start` | A new enemy encounter starts | `enemy_type`, `is_boss` |
| `tutorial_begin` | The first-fight hint appears | — |
| `tutorial_complete` | The player uses the guaranteed Tackle | — |
| `alien_defeated` | Enemy defeat is resolved, before collecting the bounty | `enemy_type`, `is_boss`, `is_final_boss`, `turns` |
| `earn_virtual_currency` | An alien bounty is collected | `virtual_currency_name`, `value` |
| `level_up` | Clearing a street unlocks the next campaign level | `level` is the newly unlocked level |
| `street_travel` | An allowed walk to an adjacent street | `from_street`, `to_street`; common `street` is the origin |
| `fight_flee` | Player flees an encounter | `enemy_type`, `turns` |
| `spend_virtual_currency` | A shop item is successfully acquired, including free loyalty items | `virtual_currency_name`, `value` (actual game cash spent), `item_name`, `item_id`, `shop_id` |
| `skill_learned` | A training tape or conditioning upgrade is acquired | `skill_id`, `shop_id` |
| `player_defeated` | A fresh player defeat, including environmental damage | `enemy_type`, `turns` |
| `shelter_recovery` | Player chooses recovery after defeat | — |
| `campaign_complete` | Final boss bounty is collected | `aliens_defeated` |

Tutorial completion means the guided move was used; players who skip it do not count as completing it. Resuming a save does not replay kills, tutorial milestones, level-ups, or endings. Each enemy's defeat marker is saved with the encounter. Analytics delivery is best-effort; blockers, network failures, or an unavailable save can affect counts. No GA4 ecommerce `purchase` event is emitted for fictional money.

Use GA4 Realtime to check incoming events. For ongoing breakdowns, register event-scoped custom dimensions such as `street`, `enemy_type`, `shop_id`, and `skill_id` in the property; event names are sent without that setup. This code does not change GA4 property settings or mark key events. Tests capture calls in a fake browser and send no Google traffic.

Reference: [Google GA4 recommended events](https://developers.google.com/analytics/devguides/collection/ga4/reference/events).

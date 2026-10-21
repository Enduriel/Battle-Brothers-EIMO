# Changelog

## Unreleased

## 10.0.7 - 2026-10-21

- Fixed throwing weapons, fire lances and other multi-type equipment never being marked for repair.
- Fixed Sell All holding back damaged items that would never be repaired, e.g. when the repair threshold is above the wait threshold. It now only waits for items marked for repair or above the repair threshold.
- Fixed large quivers, Bloodletter's Reach and large powder bags being marked for sale or favorited together with the plain versions. Re-mark them once if you had marked quivers before.
- Fixed the salvage button and Smart Loot (Legends) never selecting items in full condition, and they no longer salvage items whose type is favorited.
- Fixed the repair profit not showing on Legends armor when only its layers are damaged.
- Fixed Smart Loot giving Legends the wrong stash slot for items it swapped in.

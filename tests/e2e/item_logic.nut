// EIMO item logic: repair/salvage selection, sell-all waiting and for-sale type keys (vanilla, no Legends).
// Reproduces: #165409873 (multi-type items never repaired, sell waits), repair threshold above wait threshold,
// #154822594 (large quivers / Bloodletter's Reach sold as quivers), bug #779130 (salvage ratio of full items).
// Mods: mod_modern_hooks, mod_msu, EIMO under test. Mode: campaign (needs ::World.Assets and the character screen),
// e.g. run_probe.py item_logic.nut --mode campaign --seed eimo --with-mod held:mod_msu --with-mod <EIMO zip>.
//
// A passing run prints (ratios depend on the economy and aren't listed):
//   PROBE repairable firelance = true      (Weapon | Ammo)
//   PROBE repairable javelin = true        (Weapon | RangedWeapon | Ammo | Defensive)
//   PROBE repairable quiver = false
//   PROBE repairable throwing_net = false
//   PROBE repairable bread = false
//   PROBE repairable wardog = false
//   PROBE repairable surcoat = true
//   PROBE repair button marks firelance = true
//   PROBE repair button marks quiver = false
//   PROBE type keys distinct = true
//   PROBE sale plain -> large/coated/plain2 = false/false/true
//   PROBE legacy sale large/coated = true/true
//   PROBE legacy unmark large -> plain = false
//   PROBE salvage ratio full != 100 = true
//   PROBE salvage ratio full == damaged = true
//   PROBE waiting unmarked between thresholds = false
//   PROBE waiting marked between thresholds = true
//   PROBE waiting above repair threshold = true
//   PROBE should be sold unmarked between thresholds = true
//   PROBE repair profit damaged > 0 = true
//   PROBE repair profit full == 0 = true

local function p( k, f )
{
	local v;
	try { v = f(); } catch (e) { v = "ERROR: " + e; }
	::logInfo("PROBE " + k + " = " + v);
}

local function damaged( _script, _frac )
{
	local item = ::new(_script);
	item.setCondition(::Math.floor(item.getConditionMax() * _frac));
	return item;
}

p("eimo loaded", @() ::Hooks.hasMod("mod_EIMO") + " " + ::EIMO.Version);
p("typeof Math.floor", @() typeof ::Math.floor(1.5));
p("typeof getCondition", @() typeof ::new("scripts/items/weapons/oriental/firelance").getCondition());

// Task 1: repairability predicate
local scripts = {
	firelance = "scripts/items/weapons/oriental/firelance",
	javelin = "scripts/items/weapons/javelin",
	throwing_axe = "scripts/items/weapons/throwing_axe",
	quiver = "scripts/items/ammo/quiver_of_arrows",
	throwing_net = "scripts/items/tools/throwing_net",
	bread = "scripts/items/supplies/bread_item",
	wardog = "scripts/items/accessory/wardog_item",
	surcoat = "scripts/items/armor/padded_surcoat",
	helmet = "scripts/items/helmets/aketon_cap",
	shield = "scripts/items/shields/buckler_shield"
};
foreach (name, script in scripts)
{
	local s = script;
	p("repairable " + name, @() ::EIMO.isRepairable(::new(s)));
}

// Task 1, end to end: the character screen's ratio repair button on a damaged fire lance in the stash
local stash = ::World.Assets.getStash();
local lance = damaged(scripts.firelance, 0.25);
local quiver = ::new(scripts.quiver);
p("firelance repair ratio", @() ::EIMO.getRepairRatio(lance));
p("repair threshold", @() ::EIMO.Mod.ModSettings.getSetting(::EIMO.RepairThresholdID).getValue());
p("stash add", @() (stash.add(lance) != null) + "/" + (stash.add(quiver) != null));
p("repair button ran", function() { ::World.State.m.CharacterScreen.eimo_onRatioRepairButtonClicked(); return true; });
p("repair button marks firelance", @() lance.isToBeRepaired());
p("repair button marks quiver", @() quiver.isToBeRepaired());
p("stash cleanup", function() { stash.remove(lance); stash.remove(quiver); return true; });

// Task 3: for-sale and type favorite keys
local plain = ::new("scripts/items/ammo/quiver_of_arrows");
local plain2 = ::new("scripts/items/ammo/quiver_of_arrows");
local large = ::new("scripts/items/ammo/large_quiver_of_arrows");
local coated = ::new("scripts/items/ammo/legendary/quiver_of_coated_arrows");
p("ids", @() plain.getID() + " " + large.getID() + " " + coated.getID());
p("type keys", @() plain.eimo_getTypeKey() + " | " + large.eimo_getTypeKey() + " | " + coated.eimo_getTypeKey());
p("type keys distinct", @() plain.eimo_getTypeKey() != large.eimo_getTypeKey() && large.eimo_getTypeKey() != coated.eimo_getTypeKey() && plain.eimo_getTypeKey() != coated.eimo_getTypeKey());
p("sale plain -> large/coated/plain2", function() {
	::EIMO.ForSaleIDs.clear();
	plain.eimo_setForSale(true);
	return large.eimo_isSetForSale() + "/" + coated.eimo_isSetForSale() + "/" + plain2.eimo_isSetForSale();
});
p("legacy sale large/coated", function() {
	::EIMO.ForSaleIDs.clear();
	::EIMO.ForSaleIDs["ammo.arrows"] <- true; // as saved by 10.0.6
	return large.eimo_isSetForSale() + "/" + coated.eimo_isSetForSale();
});
p("legacy unmark large -> plain", function() {
	large.eimo_setForSale(false);
	return plain.eimo_isSetForSale();
});
p("favorite id plain -> large", function() {
	::EIMO.FavoriteIDs.clear();
	plain.eimo_setIDFavorite(true);
	local ret = large.eimo_isIDFavorite() + "/" + plain2.eimo_isIDFavorite();
	::EIMO.FavoriteIDs.clear();
	return ret;
});
::EIMO.ForSaleIDs.clear();

// Task 4: salvage ratio of an undamaged item is the same as a damaged one's (it doesn't depend on condition)
local full = ::new(scripts.surcoat);
local half = damaged(scripts.surcoat, 0.5);
p("salvage ratio full/half", @() ::EIMO.getSalvageRatio(full) + "/" + ::EIMO.getSalvageRatio(half));
p("salvage ratio full != 100", @() ::EIMO.getSalvageRatio(full) != 100);
p("salvage ratio full == damaged", @() ::Math.abs(::EIMO.getSalvageRatio(full) - ::EIMO.getSalvageRatio(half)) < 0.01);

// Task 2: repair threshold above the wait threshold
local waitSetting = ::EIMO.Mod.ModSettings.getSetting(::EIMO.WaitThresholdID);
local repairSetting = ::EIMO.Mod.ModSettings.getSetting(::EIMO.RepairThresholdID);
local oldWait = waitSetting.getValue(), oldRepair = repairSetting.getValue();
local item = damaged(scripts.firelance, 0.25);
local ratio = ::EIMO.getRepairRatio(item);
p("task2 ratio", @() ratio);
p("task2 ratio usable", @() ratio > 110 && ratio < 490);
p("set thresholds", function() { waitSetting.set(100); repairSetting.set(500); return waitSetting.getValue() + "/" + repairSetting.getValue(); });
item.eimo_setForSale(true);
p("waiting unmarked between thresholds", @() item.eimo_isWaitingForRepair());
p("should be sold unmarked between thresholds", @() item.eimo_shouldBeSold());
p("waiting marked between thresholds", function() { item.setToBeRepaired(true); local r = item.eimo_isWaitingForRepair(); item.setToBeRepaired(false); return r; });
p("waiting above repair threshold", function() { repairSetting.set(100); return item.eimo_isWaitingForRepair(); });
p("restore thresholds", function() { waitSetting.set(oldWait); repairSetting.set(oldRepair); return waitSetting.getValue() + "/" + repairSetting.getValue(); });
::EIMO.ForSaleIDs.clear();

// Repair profit shown on damaged items (Legends armor path can't be checked without Legends)
p("repair profit damaged > 0", @() ::UIDataHelper.convertItemToUIData(damaged(scripts.firelance, 0.25), false).eimo_repairProfit > 0);
p("repair profit full == 0", @() ::UIDataHelper.convertItemToUIData(::new(scripts.firelance), false).eimo_repairProfit == 0);

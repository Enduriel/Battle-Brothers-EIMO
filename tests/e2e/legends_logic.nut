// EIMO with Legends, script side: the ratio repair and salvage button handlers (#162612967), the repair profit sent
// to the UI (#159171241), full-condition salvage (bug #779130) and Legends' MSU-added item types, on real Legends
// items. Menu mode, because the harness's campaign start doesn't get past the main menu with Legends loaded: the
// probe gives ::World a minimal Assets table holding a fresh stash, and runs the handlers on an unconnected character
// screen.
// Mods: mod_modern_hooks, mod_msu 1.9.0, mod_legends 19.4.22 + mod_legends-assets 19.4.3, EIMO under test. Mode: menu.
//   run_probe.py legends_logic.nut --js legends_ui.js --mode menu --with-mod held:mod_msu --with-mod <legends zip> \
//     --with-mod <legends assets zip> --with-mod <EIMO zip>
//
// Don't put "<" in PROBE keys or values: log.html isn't escaped and the runner cuts the line there.
// Item lines are "repair/salvage" marks. A passing run (default thresholds 125/150/40) prints:
//   PROBE old check shortbow (type below Ammo) = true     (19.4.22's short bow and pitchfork don't carry the
//                                                           MSU-added types, so 10.0.6's check didn't skip them)
//   PROBE ratios knife_full repair/salvage = 100/15       (10.0.6: 100/100, so never salvaged)
//   PROBE profit armor_layer_damaged = 10                 (10.0.6: 0, hidden)
//   PROBE after repair button = only armor_layer_damaged marked (weapon repair ratios are 15-60, below 125)
//   PROBE after salvage button = knife_damaged, knife_full and pitchfork_damaged marked for salvage (ratios below 40)
//   The handlers end with "ERROR: the index 'Stash' does not exist" after marking: menu mode has no root Stash.
//   JS header module: mEIMO true, container 1, repair 1, salvage 1
//   JS click repair: eimo_onRatioRepairButtonClicked
//   JS click salvage: eimo_onRatioSalvageButtonClicked
//   JS profit layer: layers 1, class "repair-profit-layer display-block", label "42"

local function p( k, f )
{
	local v;
	try { v = f(); } catch (e) { v = "ERROR: " + e; }
	::logInfo("PROBE " + k + " = " + v);
}

local function damage( _item, _frac )
{
	_item.setCondition(::Math.floor(_item.getConditionMax() * _frac));
	return _item;
}

p("mods", @() "EIMO " + ::EIMO.Version + ", legends " + ::Hooks.getMod("mod_legends").getVersionString());

local names = ["knife_damaged", "knife_full", "shortbow_damaged", "pitchfork_damaged", "armor_layer_damaged", "armor_full"];
local items = {};
p("create knife_damaged", function() { items.knife_damaged <- damage(::new("scripts/items/weapons/knife"), 0.3); return true; });
p("create knife_full", function() { items.knife_full <- ::new("scripts/items/weapons/knife"); return true; });
p("create shortbow_damaged", function() { items.shortbow_damaged <- damage(::new("scripts/items/weapons/short_bow"), 0.3); return true; });
p("create pitchfork_damaged", function() { items.pitchfork_damaged <- damage(::new("scripts/items/weapons/legend_wooden_pitchfork"), 0.3); return true; });
p("create armor_layer_damaged", function() {
	// Base layer in full condition, only the chain layer damaged
	local armor = ::new("scripts/items/legend_armor/cloth/legend_armor_apron");
	local layer = damage(::new("scripts/items/legend_armor/chain/legend_armor_mail_shirt"), 0.3);
	p("setUpgrade", @() armor.setUpgrade(layer));
	items.armor_layer_damaged <- armor;
	return "repair " + armor.getRepair() + "/" + armor.getRepairMax() + ", base condition " + armor.getCondition() + "/" + armor.getConditionMax();
});
p("create armor_full", function() {
	local armor = ::new("scripts/items/legend_armor/cloth/legend_armor_apron");
	armor.setUpgrade(::new("scripts/items/legend_armor/chain/legend_armor_mail_shirt"));
	items.armor_full <- armor;
	return armor.getRepair() + "/" + armor.getRepairMax();
});

p("old check knife (type below Ammo)", @() items.knife_damaged.getItemType() < ::Const.Items.ItemType.Ammo);
p("old check shortbow (type below Ammo)", @() items.shortbow_damaged.getItemType() < ::Const.Items.ItemType.Ammo);
p("old check pitchfork (type below Ammo)", @() items.pitchfork_damaged.getItemType() < ::Const.Items.ItemType.Ammo);
p("old check armor (type below Ammo)", @() items.armor_full.getItemType() < ::Const.Items.ItemType.Ammo);
p("item types knife/shortbow/pitchfork/armor", @() items.knife_damaged.getItemType() + "/" + items.shortbow_damaged.getItemType() + "/" + items.pitchfork_damaged.getItemType() + "/" + items.armor_full.getItemType() + ", Ammo " + ::Const.Items.ItemType.Ammo);
p("thresholds repair/wait/salvage", @() ::EIMO.Mod.ModSettings.getSetting(::EIMO.RepairThresholdID).getValue() + "/" + ::EIMO.Mod.ModSettings.getSetting(::EIMO.WaitThresholdID).getValue() + "/" + ::EIMO.Mod.ModSettings.getSetting(::EIMO.SalvageThresholdID).getValue());

foreach (name in names)
{
	local n = name;
	if (!(n in items)) continue;
	p("ratios " + n + " repair/salvage", @() ::EIMO.getRepairRatio(items[n]) + "/" + ::EIMO.getSalvageRatio(items[n]));
	p("profit " + n, @() ::UIDataHelper.convertItemToUIData(items[n], false).eimo_repairProfit);
}
p("profit armor_layer_damaged != 0", @() ::UIDataHelper.convertItemToUIData(items.armor_layer_damaged, false).eimo_repairProfit != 0);

// Minimal world assets with a fresh stash for the button handlers
local stash = ::new("scripts/items/stash_container");
stash.setResizable(true);
stash.resize(20);
p("fake World.Assets", function() {
	::World.Assets <- {
		getStash = @() stash,
		getSellPriceMult = @() 1.0,
		getEconomicDifficulty = @() 1
	};
	return "Assets" in ::World;
});
p("stash add", function() {
	local ret = "";
	foreach (name in names)
		if (name in items) ret += name + ":" + (stash.add(items[name]) != null) + " ";
	return ret;
});

local function marks()
{
	local ret = "";
	foreach (name in names)
		if (name in items) ret += name + " = " + items[name].isToBeRepaired() + "/" + items[name].isToBeSalvaged() + ", ";
	return ret;
}

local screen;
p("character screen", function() { screen = ::new("scripts/ui/screens/character/character_screen"); return screen != null; });
p("before buttons", marks);
p("repair button handler", function() { screen.eimo_onRatioRepairButtonClicked(); return "ok"; });
p("after repair button", marks);
p("salvage button handler", function() { screen.eimo_onRatioSalvageButtonClicked(); return "ok"; });
p("after salvage button", marks);

p("remove fake World.Assets", function() { delete ::World.Assets; return "Assets" in ::World; });

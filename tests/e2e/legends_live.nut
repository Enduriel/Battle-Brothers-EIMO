// EIMO with Legends in a live campaign: the character screen's ratio repair and salvage buttons clicked in the real
// UI (#162612967), the repair profit shown on real stash slots (#159171241), and Smart Loot passing the right stash
// slot to Legends' repair queue when it swaps loot for a cheaper stash item. Pair with legends_live.js.
// Mods: mod_modern_hooks, mod_msu 1.9.0, mod_legends 19.4.22 + mod_legends-assets 19.4.3, EIMO under test.
// Mode: campaign, e.g.
//   run_probe.py legends_live.nut --js legends_live.js --mode campaign --seed eimo --timeout 600 \
//     --with-mod held:mod_msu --with-mod <legends zip> --with-mod <legends assets zip> --with-mod <EIMO zip>
//
// Item lines are "repair/salvage" marks; instance IDs vary per run, match them to the JS slot lines. A passing run:
//   PROBE smartloot swapped in = true
//   PROBE smartloot queue index == stash slot = true          (10.0.6 passed the position in a sorted index list)
//   JS slots before: each damaged probe item shows its profit (knife -16, greatsword 184, firelance 51, armor_layer 10,
//     armor_plate -6); undamaged items show none
//   JS slots after repair: repair icon on items with repair ratio above 125 (greatsword, firelance, armor_layer)
//   JS slots after salvage: also salvage icon on items with salvage ratio below 40 (knife_damaged, knife_full)

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

local function layered( _base, _layer, _frac )
{
	local armor = ::new(_base);
	local layer = ::new(_layer);
	if (_frac != null) damage(layer, _frac);
	armor.setUpgrade(layer);
	return armor;
}

p("mods", @() "EIMO " + ::EIMO.Version + ", legends " + ::Hooks.getMod("mod_legends").getVersionString());
local stash = ::World.Assets.getStash();
local waitSetting = ::EIMO.Mod.ModSettings.getSetting(::EIMO.WaitThresholdID);
local oldWait = waitSetting.getValue();
p("thresholds repair/wait/salvage", @() ::EIMO.Mod.ModSettings.getSetting(::EIMO.RepairThresholdID).getValue() + "/" + oldWait + "/" + ::EIMO.Mod.ModSettings.getSetting(::EIMO.SalvageThresholdID).getValue());
p("stash used/capacity", @() stash.getNumberOfFilledSlots() + "/" + stash.getCapacity());

// --- Smart Loot: a full stash of knives, one damaged fire lance in the loot, wait threshold lowered so it gets marked
p("smartloot", function() {
	local loot = damage(::new("scripts/items/weapons/oriental/firelance"), 0.3);
	p("smartloot loot repair ratio", @() ::EIMO.getRepairRatio(loot));
	waitSetting.set(100);

	local fillers = [];
	while (true)
	{
		local knife = ::new("scripts/items/weapons/knife");
		if (stash.add(knife) == null) break;
		fillers.push(knife);
	}
	p("smartloot fillers", @() fillers.len() + ", stash free " + (stash.getCapacity() - stash.getNumberOfFilledSlots()));

	// Swap in our own loot container and put the original back afterwards
	local hadLoot = "CombatResultLoot" in ::Tactical;
	local oldLoot = hadLoot ? ::Tactical.CombatResultLoot : null;
	p("smartloot loot container existed", @() hadLoot + " " + (oldLoot != null));
	local container = ::new("scripts/items/stash_container");
	container.setResizable(true);
	container.add(loot);
	::Tactical.CombatResultLoot <- container;

	local screen = ::new("scripts/ui/screens/tactical/tactical_combat_result_screen");
	p("smartloot handler", function() { screen.eimo_onSmartLootButtonPressed(); return "ok"; });
	local idx = stash.getItems().find(loot);
	p("smartloot swapped in", @() idx != null);
	p("smartloot marked", @() loot.isToBeRepaired());
	p("smartloot queue index/stash slot", @() loot.m.IsToBeRepairedQueue + "/" + idx);
	p("smartloot queue index == stash slot", @() loot.m.IsToBeRepairedQueue == idx);

	// clean up: everything the probe put in the stash and the loot
	foreach (knife in fillers) stash.remove(knife);
	if (idx != null) stash.remove(loot);
	if (hadLoot) ::Tactical.CombatResultLoot = oldLoot;
	else delete ::Tactical.CombatResultLoot;
	waitSetting.set(oldWait);
	return "stash used " + stash.getNumberOfFilledSlots() + ", wait " + waitSetting.getValue();
});

// --- Buttons: real stash items, real character screen, clicked from legends_live.js
local names = ["knife_damaged", "knife_full", "greatsword_damaged", "firelance_damaged", "armor_layer_damaged", "armor_plate_damaged", "armor_full"];
local items = {};
p("create items", function() {
	items.knife_damaged <- damage(::new("scripts/items/weapons/knife"), 0.3);
	items.knife_full <- ::new("scripts/items/weapons/knife");
	items.greatsword_damaged <- damage(::new("scripts/items/weapons/greatsword"), 0.3);
	items.firelance_damaged <- damage(::new("scripts/items/weapons/oriental/firelance"), 0.3);
	items.armor_layer_damaged <- layered("scripts/items/legend_armor/cloth/legend_armor_apron", "scripts/items/legend_armor/chain/legend_armor_mail_shirt", 0.3);
	items.armor_plate_damaged <- layered("scripts/items/legend_armor/cloth/legend_armor_apron", "scripts/items/legend_armor/plate/legend_armor_cult_armor", 0.3);
	items.armor_full <- layered("scripts/items/legend_armor/cloth/legend_armor_apron", "scripts/items/legend_armor/chain/legend_armor_mail_shirt", null);
	return true;
});
foreach (name in names)
{
	local n = name;
	if (!(n in items)) continue;
	p("item " + n, @() "instance " + items[n].getInstanceID() + ", stash slot " + stash.add(items[n]) + ", ratios repair/salvage " + ::EIMO.getRepairRatio(items[n]) + "/" + ::EIMO.getSalvageRatio(items[n]) + ", profit " + ::UIDataHelper.convertItemToUIData(items[n], false).eimo_repairProfit);
}

local function logMarks( _tag )
{
	p(_tag, function() {
		local ret = "";
		foreach (name in names)
			if (name in items) ret += name + " = " + items[name].isToBeRepaired() + "/" + items[name].isToBeSalvaged() + ", ";
		return ret;
	});
}

logMarks("t0 before clicks");
p("open character screen", function() { ::World.State.showCharacterScreen(); return ::World.State.m.CharacterScreen.isVisible(); });
// legends_live.js clicks the buttons and reports the icons the refreshed stash shows; those come from the items'
// repair/salvage flags. (::Time.scheduleEvent(::TimeUnit.Real, ...) fired at once here, so no timed SQ logs.)

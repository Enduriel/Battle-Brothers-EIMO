// EIMO's price, repair-cost and sell code paths on the installed BB (1.5.2.3 changed building shop lists and added
// building.getPriceMult; the old crash #717232 was "'getPriceMult' does not exist" in the paid-repair code).
// Runs on vanilla and on Legends: the paid repair of a brother (character screen), the town repair price, and the
// shop's Sell All button on a real settlement building.
// Mods: mod_modern_hooks, mod_msu, EIMO under test; optionally mod_legends 19.4.22 + mod_legends-assets 19.4.3.
// Mode: campaign, e.g.
//   run_probe.py price_paths.nut --mode campaign --seed eimo --with-mod held:mod_msu --with-mod <EIMO zip>
//
// A passing run prints no ERROR values, and:
//   PROBE repair nearby after moving to town = true
//   PROBE paid repair: body condition full = true
//   PROBE paid repair: money spent == quoted price = true
//   PROBE sell all: marked items sold = true
//   PROBE sell all: favorite kept = true
//   PROBE sell all: money gained == sum of sell prices = true

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

local legends = ::Hooks.hasMod("mod_legends");
p("mods", @() "EIMO " + ::EIMO.Version + ", legends " + legends);

// A town with a repair building and a building with a shop stash
local town, shop;
p("find town", function() {
	foreach (settlement in ::World.EntityManager.getSettlements())
	{
		local repair = null, stashBuilding = null;
		foreach (building in settlement.eimo_getBuildings())
		{
			if (building.isRepairOffered()) repair = building;
			if (building.getStash() != null) stashBuilding = building;
		}
		if (repair != null && stashBuilding != null)
		{
			town = settlement;
			shop = stashBuilding;
			return settlement.getName() + ", shop " + shop.getID() + ", town price mult " + settlement.getPriceMult();
		}
	}
	return "none";
});

local screen = ::World.State.m.CharacterScreen;
local bro = ::World.getPlayerRoster().getAll()[0];
local body = bro.getItems().getItemAtSlot(::Const.ItemSlot.Body);
p("bro body", @() body == null ? "none" : body.getID());

p("repair nearby before moving", @() screen.eimo_canRepairNearby());
p("move player to town", function() { ::World.State.getPlayer().setPos(town.getPos()); return true; });
p("repair nearby after moving to town", @() screen.eimo_canRepairNearby());

// Paid repair (copy of the vanilla town repair price, uses the settlement's getPriceMult)
p("damage body", function() {
	if (legends && ::EIMO.isLegendArmor(body))
	{
		foreach (upgrade in body.m.Upgrades)
			if (upgrade != null) damage(upgrade, 0.5);
	}
	damage(body, 0.5);
	return ::EIMO.isDamaged(body);
});
local quoted;
p("select bro", function() { screen.eimo_setSelectedBrother(bro.getID()); quoted = screen.eimo_getRepairPriceBrother(bro); return quoted; });
p("repair data", function() {
	local data = screen.eimo_getRepairData();
	return "CanRepair " + (!("CanRepair" in data) || data.CanRepair) + ", company " + data.CompanyPrice + ", selected " + data.SelectedBrotherPrice;
});
local moneyBefore = ::World.Assets.getMoney();
p("paid repair", function() { screen.eimo_paidRepairBrother(bro); return "ok"; });
p("paid repair: body condition full", @() !::EIMO.isDamaged(body));
p("paid repair: money spent == quoted price", @() moneyBefore - ::World.Assets.getMoney() == quoted);
p("paid repair: spent/quoted", @() (moneyBefore - ::World.Assets.getMoney()) + "/" + quoted);

// Sell All on the shop of that town
local stash = ::World.Assets.getStash();
local sell1 = ::new("scripts/items/weapons/greatsword");
local sell2 = ::new("scripts/items/weapons/greatsword");
local keep = ::new("scripts/items/weapons/greatsword");
p("sell all setup", function() {
	stash.add(sell1); stash.add(sell2); stash.add(keep);
	sell1.eimo_setForSale(true);
	keep.eimo_setFavorite(true);
	return sell2.eimo_isSetForSale() + " " + keep.eimo_shouldBeSold();
});
local module = ::World.State.m.WorldTownScreen.getShopDialogModule();
local expected = 0;
p("sell prices", function() { expected = sell1.getSellPrice() + sell2.getSellPrice(); return expected; });
local moneyBeforeSell = ::World.Assets.getMoney();
p("sell all handler", function() {
	module.setShop(shop);
	local result = module.eimo_onSellAllButtonClicked();
	module.setShop(null);
	return "Result " + result.Result + ", stash used " + result.StashSpaceUsed;
});
p("sell all: marked items sold", @() stash.getItems().find(sell1) == null && stash.getItems().find(sell2) == null);
p("sell all: favorite kept", @() stash.getItems().find(keep) != null);
p("sell all: money gained == sum of sell prices", @() ::World.Assets.getMoney() - moneyBeforeSell == expected);
p("sell all: gained/expected", @() (::World.Assets.getMoney() - moneyBeforeSell) + "/" + expected);
p("cleanup", function() { keep.eimo_setFavorite(false); sell1.eimo_setForSale(false); stash.remove(keep); return true; });

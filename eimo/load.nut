local page = ::EIMO.Mod.ModSettings.addPage("Save Settings");

::EIMO.RepairThresholdID <- "RepairThreshold";
page.addRangeSetting(::EIMO.RepairThresholdID, 125, 100, 500, 10, "Repair Threshold", "Above this threshold of repair profitability items will be marked for repair by the repair button (Smart Loot uses the wait Threshold).\n\nHigher values mean increased profitability");

::EIMO.WaitThresholdID <- "WaitThreshold";
page.addRangeSetting(::EIMO.WaitThresholdID, 150, 100, 500, 10, "Wait Threshold", "Above this threshold of repair profitability items will not be sold until they are fully repaired and will be set to repair when using smart loot.\n\nHigher values mean increased profitability");

if (::mods_getRegisteredMod("mod_legends") != null)
{
	::EIMO.SalvageThresholdID <- "SalvageThreshold";
	page.addRangeSetting(::EIMO.SalvageThresholdID, 40, 0, 200, 5, "Salvage Threshold", "Below this threshold of repair profitability items will be salvaged when using smart loot or the salvage all button.\n\nLower values mean increased profitability")
}

::EIMO.VisibilityLevelID <- "VisibilityLevel";
page.addEnumSetting(::EIMO.VisibilityLevelID, "Full", ["None", "Reduced", "Full"], "Item Info Visibilty", "Allows hiding of the item info that EIMO provides if you don't want to use those features.")

::EIMO.InventoryAddonsID <- "InventoryAddons";
page.addBooleanSetting(::EIMO.InventoryAddonsID, true, "Inventory Addons", "Shows a sidebar in your party inventory with some additional uses.");

page.addTitle("debugTitle", "Debug Settings");
page.addDivider("debugDivider");

::EIMO.LogID <- "Log";
local log = page.addBooleanSetting(::EIMO.LogID, false, "Enable Logging");
log.addCallback(function ( _newValue )
{
	::EIMO.Mod.Debug.setFlag(::MSU.System.Debug.DefaultFlag, _newValue);
});

::EIMO.RepairBrothersData <- {
	SelectedBrotherPrice = 0,
	CompanyPrice = 0,
	CanRepairNearby = false
}

::EIMO.Mod.Keybinds.addJSKeybind("SetForSale", "shift+rightclick", "Mark Item Type For Sale", "All items marked for sale will be automatically sold when using autosell");
::EIMO.Mod.Keybinds.addJSKeybind("SetFavorite", "ctrl+shift+rightclick", "Favorite Item", "Favorited items will never be automatically sold and will be sorted above non-favorite items when autosorting.");
::EIMO.Mod.Keybinds.addJSKeybind("SetIDFavorite", "alt+shift+rightclick", "Favorite Item Type", "Favorite all items of this time, favorite items will never be automatically sold and will be sorted above non-favorite items when autosorting.");

::EIMO.Mod.Registry.addModSource(::MSU.System.Registry.ModSourceDomain.GitHub, "https://github.com/Enduriel/Battle-Brothers-EIMO");
::EIMO.Mod.Registry.setUpdateSource(::MSU.System.Registry.ModSourceDomain.GitHub);
::EIMO.Mod.Registry.addModSource(::MSU.System.Registry.ModSourceDomain.NexusMods, "https://www.nexusmods.com/battlebrothers/mods/239");

::includeFile("eimo/", "global_functions.nut");
::includeLoad("eimo/", "hooks");
::includeLoad("eimo/", "ui");

this.MSU.System.ModSettings.registerMod(this.EIMO.ID);
this.MSU.System.Debug.registerMod(::EIMO.ID);

local panel = this.MSU.System.ModSettings.get(this.EIMO.ID);

local page = this.MSU.Class.SettingsPage("Save Settings");
panel.addPage(page);

::EIMO.RepairThresholdID <- "repairThreshold";
local repairThreshold = this.MSU.Class.RangeSetting(::EIMO.RepairThresholdID, 125, 100, 500, 10, "Repair Threshold");
repairThreshold.setDescription("Above this threshold of profitability items will be marked for repair by the repair button (Smart Loot uses the wait Threshold).\n\nA value of 150% means 50% profit from selling a repaired item compared to the cost of buying tools")
page.add(repairThreshold);

::EIMO.WaitThresholdID <- "waitThreshold";
local waitThreshold = this.MSU.Class.RangeSetting(::EIMO.WaitThresholdID, 150, 100, 500, 10, "Wait Threshold");
waitThreshold.setDescription("Above this threshold of profitability items will not be sold until they are fully repaired and will be set to repair when using smart loot.\n\nA value of 150% means 50% profit from selling a repaired item compared to the cost of buying tools");
page.add(waitThreshold);

if (::mods_getRegisteredMod("mod_legends") != null)
{
	::EIMO.SalvageThresholdID <- "salvageThreshold";
	local salvageThreshold = this.MSU.Class.RangeSetting(::EIMO.SalvageThresholdID, 40, 0, 200, 5, "Salvage Threshold")
	salvageThreshold.setDescription("Below this threshold of profitability items will be salvaged when using smart loot or the salvage all button.\n\nA value of 50% means twice the value gained in tools from salvaging compared to selling the item.");
	page.add(salvageThreshold);
}

::EIMO.VisibilityLevelID <- "visibilityLevel";
local visibilityLevel = this.MSU.Class.EnumSetting(::EIMO.VisibilityLevelID, "Full", ["None", "Reduced", "Full"], "Item Info Visibilty")
visibilityLevel.setDescription("Allows hiding of the item info that EIMO provides if you don't want to use those features.");
page.add(visibilityLevel);

::EIMO.InventoryAddonsID <- "inventoryAddons";
local inventoryAddons = this.MSU.Class.BooleanSetting(::EIMO.InventoryAddonsID, true, "Inventory Addons");
inventoryAddons.setDescription("Shows an extra screen in party inventory with some additional minor uses.");
page.add(inventoryAddons);

page.add(this.MSU.Class.SettingsDivider("debug", "Debug Settings"));

::EIMO.LogID <- "log";
local log = this.MSU.Class.BooleanSetting(::EIMO.LogID, false, "Enable Logging");
log.addCallback(function ( _newValue )
{
	this.MSU.System.Debug.setFlag(::EIMO.ID, this.MSU.System.Debug.DefaultFlag, _newValue)
});
page.add(log);

::EIMO.RepairBrothersData <- {
	SelectedBrotherPrice = 0,
	CompanyPrice = 0,
	CanRepairNearby = false
}

::includeFile("eimo/", "global_functions.nut");
::includeLoad("eimo/", "hooks");
::includeLoad("eimo/", "ui");

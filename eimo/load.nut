this.MSU.System.ModSettings.registerMod(this.EIMO.ID);
local panel = this.MSU.System.ModSettings.get(this.EIMO.ID);

local page = this.MSU.Class.SettingsPage("Save Settings");

::EIMO.RepairThresholdID <- "repairThreshold";
local repairThreshold = this.MSU.Class.RangeSetting(::EIMO.RepairThresholdID, 125, 100, 500, 10, "Change Repair Threshold");
repairThreshold.setDescription("Above this threshold of profitability items will be marked for repair by the repair button (Smart Loot uses the wait Threshold).\n\nA value of 150% means 50% profit from selling a repaired item compared to the cost of buying tools")
page.add(repairThreshold);

::EIMO.WaitThresholdID <- "waitThreshold";
local waitThreshold = this.MSU.Class.RangeSetting(::EIMO.WaitThresholdID, 150, 100, 500, 10, "Change Wait Until Repaired Threshold");
waitThreshold.setDescription("Above this threshold of profitability items will not be sold until they are fully repaired and will be set to repair when using smart loot.\n\nA value of 150% means 50% profit from selling a repaired item compared to the cost of buying tools");
page.add(waitThreshold);

if (::mods_getRegisteredMod("mod_legends") != null)
{
	::EIMO.SalvageThresholdID <- "salvageThreshold";
	local salvageThreshold = this.MSU.Class.RangeSetting(::EIMO.SalvageThresholdID, 40, 0, 200, 5, "Change Salvage Threshold")
	salvageThreshold.setDescription("Below this threshold of profitability items will be salvaged when using smart loot or the salvage all button.\n\nA value of 50% means twice the value gained in tools from salvaging compared to selling the item.");
	page.add(salvageThreshold);
}

::EIMO.VisibilityLevelID <- "visibilityLevel";
local visibilityLevel = this.MSU.Class.EnumSetting(::EIMO.VisibilityLevelID, "Full", ["None", "Reduced", "Full"], "Change EIMO Info Visibilty")
visibilityLevel.setDescription("Allows hiding of the item info that EIMO provides if you don't want to use those features.");
page.add(visibilityLevel);

page.add(this.MSU.Class.SettingsDivider("debug", "Debug Settings"));



::includeFile("eimo/", "global_functions.nut");
::includeLoad("eimo/", "hooks");


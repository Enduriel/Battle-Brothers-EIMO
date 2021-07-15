this.getroottable().Const.EIMO.hookTooltipEvents <- function()
{
	::mods_hookNewObjectOnce("ui/screens/tooltip/tooltip_events", function(o) {
		local queryTooltipData = o.general_queryUIElementTooltipData;
		o.general_queryUIElementTooltipData = function(entityId, elementId, elementOwner)
		{
			local tooltip = queryTooltipData(entityId, elementId, elementOwner);
			if(tooltip != null) return tooltip;
			switch (elementId)
			{
			case "EIMO.RepairButton":
				return [
				{
					id = 1,
					type = "title",
					text = "Mark Items For Repair"
				},
				{
					id = 2,
					type = "description",
					text = "Marks all worthwile repairable items in your inventory for repair."
				},
				{
					id = 3,
					type = "hint",
					icon = "ui/icons/EIMO_mouse_right_button_shift.png",
					text = "Shift-click on items to mark their type for sale"
				},
				{
					id = 4,
					type = "hint",
					icon = "ui/icons/EIMO_mouse_right_button_ctrl_shift.png",
					text = "Ctrl-Shift-click on items to mark them as favorite (they will then not be sold)"
				}];
			case "EIMO.SettingsButton":
				return [
				{
					id = 1,
					type = "title",
					text = "Toggle EIMO Settings"
				},
				{
					id = 2,
					type = "description",
					text = "Toggles the EIMO settings window"
				}];
			case "EIMO.ChangeVisibilityButton":
				return [
				{
					id = 1,
					type = "title",
					text = "Cycle Visibility of EIMO Info"
				},
				{
					id = 2,
					type = "description",
					text = "Cycles through 3 different levels of visibility for EIMO Info"
				}];
			case "EIMO.RepairThresholdSlider":
				return [
				{
					id = 1,
					type = "title",
					text = "Change Repair Threshold"
				},
				{
					id = 2,
					type = "description",
					text = "Above this threshold of profitability items will be marked for repair by the repair button (Smart Loot uses the wait Threshold).\n\nA value of 150% means 50% profit from selling a repaired item compared to the cost of buying tools"
				}];
			case "EIMO.WaitThresholdSlider":
				return [
				{
					id = 1,
					type = "title",
					text = "Change Wait Until Repaired Threshold"
				},
				{
					id = 2,
					type = "description",
					text = "Above this threshold of profitability items will not be sold until they are fully repaired.\n\nA value of 150% means 50% profit from selling a repaired item compared to the cost of buying tools"
				}];
			case "EIMO.SalvageThresholdSlider":
				return [
				{
					id = 1,
					type = "title",
					text = "Change Salvage Threshold"
				},
				{
					id = 2,
					type = "description",
					text = "Below this threshold of profitability items will be salvaged when using smart loot or the salvage all button.\n\nA value of 50% means twice the value gained in tools from salvaging compared to selling the item."
				}];
				return [
				{
					id = 1,
					type = "title",
					text = "Sell All Loot"
				},
				{
					id = 2,
					type = "description",
					text = "Sell all items marked for sale. Favorited items will be ignored, even if marked for sale. Items with ratio 175+ will only be sold when in full condition."
				}];
			case "EIMO.SmartLootButton":
				return [
				{
					id = 1,
					type = "title",
					text = "Smart Loot"
				},
				{
					id = 2,
					type = "description",
					text = "Intelligently loot all items including moving items from player inventory and automatically adding consumables to their totals."
				}];
			case "EIMO.RepairBrotherButton":
				local ret = [
				{
					id = 1,
					type = "title",
					text = "Repair Current Brother's Equipment"
				},
				{
					id = 2,
					type = "description",
					text = "Repair current brother's equipment at the local smith instantly by paying a fee.\n\nRequires you to be within 2 world tiles of a town with a smith and have enough money for the repair."
				}];

				if(this.Const.EIMO.characterScreen.EIMOcanRepair())
				{
					ret.push({
						id = 3,
						type = "hint",
						icon = "ui/icons/asset_money.png",
						text = "Repair Cost: " + this.Const.EIMO.characterScreen.EIMOgetRepairPriceBrother(this.Const.EIMO.characterScreen.EIMOgetSelectedBrother())
					});
				}
				return ret;
			case "EIMO.RepairCompanyButton":
				local ret = [
				{
					id = 1,
					type = "title",
					text = "Repair Company's Equipment"
				},
				{
					id = 2,
					type = "description",
					text = "Repair your entire company's equipment at the local smith instantly by paying a fee.\n\nRequires you to be within 2 world tiles of a town with a smith and have enough money for the repair."
				}];

				if(this.Const.EIMO.characterScreen.EIMOcanRepair())
				{
					ret.push({
						id = 3,
						type = "hint",
						icon = "ui/icons/asset_money.png",
						text = "Repair Cost: " + this.Const.EIMO.characterScreen.EIMOgetRepairPriceCompany()
					});
				}
				return ret;
			case "EIMO.SalvageAllButton":
				return [
				{
					id = 1,
					type = "title",
					text = "Mark Items For Salvage"
				},
				{
					id = 2,
					type = "description",
					text = "Marks all salvageable items in your iventory with low enough ratio for salvage"
				}];
			}
			return null;
		}
	});	
}

::mods_hookNewObjectOnce("ui/screens/tooltip/tooltip_events", function(o) {
	local queryTooltipData = o.general_queryUIElementTooltipData;
	o.general_queryUIElementTooltipData = function(entityId, elementId, elementOwner)
	{
		local tooltip = queryTooltipData(entityId, elementId, elementOwner);
		if (tooltip != null) return tooltip;
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
		case "EIMO.SalvageButton":
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
		case "EIMO.SellAllButton":
			return [
			{
				id = 1,
				type = "title",
				text = "Sell All Loot"
			},
			{
				id = 2,
				type = "description",
				text = "Sell all items marked for sale. Favorited items will be ignored, even if marked for sale. Items above a ratio of " + ::EIMO.Mod.ModSettings.getSetting(::EIMO.WaitThresholdID).getValue() + " will only be sold when in full condition."
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

			if (::EIMO.RepairBrothersData.CanRepairNearby)
			{
				ret.push({
					id = 3,
					type = "hint",
					icon = "ui/icons/asset_money.png",
					text = "Repair Cost: " + ::EIMO.RepairBrothersData.SelectedBrotherPrice
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

			if (::EIMO.RepairBrothersData.CanRepairNearby)
			{
				ret.push({
					id = 3,
					type = "hint",
					icon = "ui/icons/asset_money.png",
					text = "Repair Cost: " + ::EIMO.RepairBrothersData.CompanyPrice
				});
			}
			return ret;
		}
		return null;
	}
});

::EIMO.Mod.Tooltips.setTooltips({
	CharacterScreen = {
		RepairButton = ::MSU.Class.CustomTooltip(function(_data)
		{
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
				text = ::MSU.String.capitalizeFirst(::EIMO.Mod.ModSettings.getSetting("SetForSale").getValue()) + " on items to mark their type for sale"
			},
			{
				id = 4,
				type = "hint",
				text = ::MSU.String.capitalizeFirst(::EIMO.Mod.ModSettings.getSetting("SetFavorite").getValue()) + " on items to mark them as favorite (they will then not be sold)"
			}];
		}),
		SalvageButton = ::MSU.Class.BasicTooltip("Mark Items For Salvage", "Marks all salvageable items in your iventory with low enough ratio for salvage."),
		RepairBrotherButton = ::MSU.Class.CustomTooltip(function(_data)
		{
			local ret = [
			{
				id = 1,
				type = "title",
				text = "Repair Current Brother's Equipment"
			},
			{
				id = 2,
				type = "description",
				text = "Repair current brother's equipment at the local smith instantly by paying a fee.\n\nRequires you to be within 2 world tiles of a town offering repairs and have enough money for the repair."
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
		}),
		RepairCompanyButton = ::MSU.Class.CustomTooltip(function(_data)
		{
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
		})
	},
	TownShopDialogModule = {
		SellAllButton = ::MSU.Class.BasicTooltip("Sell All Loot", "Sell all items marked for sale. Favorited items will be ignored, even if marked for sale. Items above a ratio of " + ::EIMO.Mod.ModSettings.getSetting(::EIMO.WaitThresholdID).getValue() + " will only be sold when in full condition.")
	},
	TacticalCombatResultScreen = {
		SmartLootButton = ::MSU.Class.BasicTooltip("Smart Loot", "Intelligently loot all items including moving items from player inventory and automatically adding consumables to their totals.")
	}
})

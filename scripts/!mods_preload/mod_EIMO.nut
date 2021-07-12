local gt = this.getroottable();

gt.Const.EIMO <- {};

::mods_registerMod("mod_EIMO_legends", 8.0,"End's Inventory Management Overhaul Legends");
::mods_queue(null, null, function()
{
	gt.Const.EIMO.RepairThreshold <- 125;
	gt.Const.EIMO.SellThreshold <- 150;
	gt.Const.EIMO.SalvageThreshold <- 40;
	gt.Const.EIMO.ShowSettings <- true;

	local getToolBuyPrice = function()
	{
		if (!("Assets" in this.World)) return 1;

		return 1.25 * this.Math.ceil(200 * this.Const.Difficulty.BuyPriceMult[this.World.Assets.getEconomicDifficulty()]); //1.25x to account for buy multipliers in large towns
	}

	local getRepairCost = function(item)
	{
		if(::mods_isClass(item, "legend_armor") != null || ::mods_isClass(item, "legend_helmet") != null)
		{
			return getToolBuyPrice() / 20 * (item.getRepairMax() - item.getRepair()) / 15;
		}
		else
		{
			return getToolBuyPrice() / 20 * (item.getConditionMax() - item.getCondition()) / 15;
		}
	}

	local getMaxItemSellPrice = function(item)
	{
		if (!("Assets" in this.World)) return 1;

		local fullValue = item.m.Value; // we would like to use item.getValue() but it's inconsistent as to whether certain modifiers are applied
		if("Assets" in World) // this is false in the tutorial, for example
		{
			fullValue *= World.Assets.getSellPriceMult() * Const.Difficulty.SellPriceMult[World.Assets.getEconomicDifficulty()];
		}

		if(item.isItemType(Const.Items.ItemType.Food | Const.Items.ItemType.TradeGood)) return fullValue; // trade goods sell for full value and don't deteriorate

		if(item.isItemType(Const.Items.ItemType.Loot)) return fullValue * Const.World.Assets.BaseLootSellPrice; // loot sells for nearly full value and doesn't deteriorate

		if(item.isItemType(Const.Items.ItemType.Supply)) return fullValue * 1.5; // food and supplies are not sold, so use the replacement cost (w/ 50% markup)

		return this.Math.floor(fullValue * Const.World.Assets.BaseSellPrice);
	}

	local getMaxArmorSellPrice = function(armor)
	{
		local upgrade = armor.getUpgrade();
		if(upgrade != null)
		{
			return getMaxItemSellPrice(upgrade) + getMaxItemSellPrice(armor);
		}
		else 
		{
		    return getMaxItemSellPrice(armor);
		}
	}

	local getMaxLegendArmorSellPrice = function(armor)
	{
		local sellPrice = getMaxItemSellPrice(armor);
		foreach(upgrade in armor.m.Upgrades)
		{
			if(upgrade != null) sellPrice += getMaxItemSellPrice(upgrade);
		}
		return sellPrice;
	}
	gt.Const.EIMO.getMaxSellPrice <- function (item)
	{
		if(::mods_isClass(item, "legend_armor") != null || ::mods_isClass(item, "legend_helmet") != null)
		{
			return getMaxLegendArmorSellPrice(item);
		}
		else if(::mods_isClass(item, "armor") != null)
		{
			return getMaxArmorSellPrice(item);
		}
		else 
		{
		    return getMaxItemSellPrice(item);
		}
	}

	local getValueChange = function (item)
	{
		if(::mods_isClass(item, "legend_armor") != null || ::mods_isClass(item, "legend_helmet") != null)
		{
			local valueChange = getMaxItemSellPrice(item) * (1 - (item.getCondition() / item.getConditionMax()));
			foreach(upgrade in item.m.Upgrades)
			{
				if (upgrade != null)
				{
					valueChange += getMaxItemSellPrice(upgrade) * (1 - (upgrade.getCondition() / upgrade.getConditionMax()));
				}
			}
			return valueChange;
		}
		else
		{
			return this.Const.EIMO.getMaxSellPrice(item) * (1 - (item.getCondition() / item.getConditionMax()));
		}
	}

	gt.Const.EIMO.getDratio <- function (item)
	{
		if((::mods_isClass(item, "legend_armor") != null || ::mods_isClass(item, "legend_helmet") != null) && item.getRepairMax() == item.getRepair())
		{
			return 100
		}
		if(!(::mods_isClass(item, "legend_armor") != null || ::mods_isClass(item, "legend_helmet") != null) && item.getConditionMax() == item.getCondition())
		{
			return 100
		}
		else
		{
			return 100 * getValueChange(item)/getRepairCost(item);
		}
	}
	gt.Const.EIMO.getSratio <- function (item)
	{
		local durability;
		if(::mods_isClass(item, "legend_armor") != null || ::mods_isClass(item, "legend_helmet") != null) durability = item.getRepairMax();
		else durability = item.getConditionMax();
		
		return 100 * this.Const.EIMO.getMaxSellPrice(item) / (getToolBuyPrice() / 20 * durability / 15);
	}

	gt.Const.EIMO.calcBalanceDiffFromRepair <- function(item)
	{
		return getValueChange(item) - getRepairCost(item);
	}

	gt.Const.EIMO.visibilityLevel <- 0;

	gt.Const.EIMO.getVisibilityLevelFlag <- @() "EIMO.VL";
	gt.Const.EIMO.getStashIndexFlag <- @(i) "EIMO." + i + ".Fav";
	gt.Const.EIMO.getItemSaleFlag <- @(item) "EIMO." + item.getID() + item.getName() + ".Sell";
	gt.Const.EIMO.getRepairThresholdFlag <- @() "EIMO.RepairThreshold";
	gt.Const.EIMO.getSellThresholdFlag <- @() "EIMO.SellThreshold";
	gt.Const.EIMO.getSalvageThresholdFlag <- @() "EIMO.SalvageThreshold";
	gt.Const.EIMO.getShowSettingsFlag <- @() "EIMO.ShowSettings";


	::mods_registerJS("mod_EIMO.js");
	::mods_registerJS("mod_EIMO_character_screen_datasource.js");
	::mods_registerJS("mod_EIMO_character_screen_right.js");
	::mods_registerJS("mod_EIMO_town_shop.js")
	::mods_registerJS("mod_EIMO_nohook.js");
	::mods_registerCSS("mod_EIMO.css");

	::mods_registerJS("smart_loot/mod_EIMO_smart_loot.js");
	::mods_registerCSS("smart_loot/mod_EIMO_smart_loot.css");

	gt.Const.EIMO.hookTownShop();
	gt.Const.EIMO.hookDataHelper();
	gt.Const.EIMO.hookItemsStash();
	gt.Const.EIMO.hookTooltipEvents();
	gt.Const.EIMO.hookWorldState();
	gt.Const.EIMO.hookCharacterScreen();

	delete gt.Const.EIMO.hookTownShop;
	delete gt.Const.EIMO.hookCharacterScreen;
	delete gt.Const.EIMO.hookWorldState;
	delete gt.Const.EIMO.hookTooltipEvents;
	delete gt.Const.EIMO.hookItemsStash;
	delete gt.Const.EIMO.hookDataHelper;
});




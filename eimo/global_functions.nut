// General utility functions
::EIMO.isLegendArmor <- function(_item)
{
	return ::MSU.isKindOf(_item, "legend_armor") || ::MSU.isKindOf(_item, "legend_helmet");
}

// Equipment that loses condition and can be repaired with tools. Item types are bit flags and an item can have several
// (e.g. throwing weapons are Weapon | Ammo, and Legends adds its own types through MSU), so test the flags.
::EIMO.isRepairable <- function( _item )
{
	local ItemType = ::Const.Items.ItemType;
	return _item.isItemType(ItemType.Weapon | ItemType.Shield | ItemType.Armor | ItemType.Helmet);
}

// Repair & Salvage calculations

local function getToolBuyPrice()
{
	local toolBuyPrice = this.new("scripts/items/supplies/armor_parts_item").getValue(); // Should maybe be cached
	return 1.25 * ::Math.ceil(toolBuyPrice * ("Assets" in ::World ? ::Const.Difficulty.BuyPriceMult[::World.Assets.getEconomicDifficulty()] : 1.0)); //1.25x to account for buy multipliers in large towns
}

local function getToolPriceMult()
{
	return getToolBuyPrice() / 20 / 15;
}

local function getMaxItemSellPrice( _item )
{
	local fullValue = _item.m.Value;
	if ("Assets" in ::World) fullValue *= ::World.Assets.getSellPriceMult() * ::Const.Difficulty.SellPriceMult[::World.Assets.getEconomicDifficulty()];

	if (_item.isItemType(::Const.Items.ItemType.Food | ::Const.Items.ItemType.TradeGood))
	{
		return fullValue; // trade goods sell for full value and don't deteriorate
	}
	else if (_item.isItemType(::Const.Items.ItemType.Loot)) // loot sells for nearly full value and doesn't deteriorate
	{
		return fullValue * ::Const.World.Assets.BaseLootSellPrice;
	}
	else if (_item.isItemType(::Const.Items.ItemType.Supply))
	{
		return fullValue * 1.5; // food and supplies are not sold, so use the replacement cost (w/ 50% markup)
	}

	return ::Math.floor(fullValue * ::Const.World.Assets.BaseSellPrice);
}

local function getMaxArmorSellPrice( _armor )
{
	local upgrade = _armor.getUpgrade();
	return getMaxItemSellPrice(_armor) + (upgrade == null ? 0 : getMaxItemSellPrice(upgrade));
}

local function getMaxLegendsArmorSellPrice( _armor )
{
	local sellPrice = getMaxItemSellPrice(_armor);
	foreach (upgrade in _armor.m.Upgrades)
	{
		if (upgrade != null)
		{
			sellPrice += getMaxItemSellPrice(upgrade);
		}
	}
	return sellPrice;
}

::EIMO.getMaxSellPrice <- function( _item )
{
	if (::EIMO.isLegendArmor(_item))
	{
		return getMaxLegendsArmorSellPrice(_item);
	}
	else if (::MSU.isKindOf(_item, "armor"))
	{
		return getMaxArmorSellPrice(_item)
	}
	return getMaxItemSellPrice(_item);
}

::EIMO.isDamaged <- function( _item )
{
	if (::EIMO.isLegendArmor(_item))
	{
		return _item.getRepair() < _item.getRepairMax();
	}
	return _item.getCondition() < _item.getConditionMax();
}

local function getRatio( _item, _valueChangeFunction, _priceFunction )
{
	local price = _priceFunction(_item);
	if (price == 0)
	{
		return 100;
	}
	return 100 * _valueChangeFunction(_item) / price;
}

local function getValueChange( _item, _function )
{
	if (::EIMO.isLegendArmor(_item))
	{
		local valueChange = _function(_item);
		foreach (upgrade in _item.m.Upgrades)
		{
			if (upgrade != null)
			{
				valueChange += _function(upgrade);
			}
		}
		return valueChange
	}
	return _function(_item);
}

// Repair calculations

local function getFinalRepairValueChange( _item )
{
	return ::EIMO.getMaxSellPrice(_item) * (1 - _item.getCondition() / _item.getConditionMax());
}

local function getRepairValueChange( _item )
{
	return getValueChange(_item, getFinalRepairValueChange);
}

local function getRepairCost( _item )
{
	if (::EIMO.isLegendArmor(_item))
	{
		return getToolPriceMult() * (_item.getRepairMax() - _item.getRepair());
	}

	return getToolPriceMult() * (_item.getConditionMax() - _item.getCondition());
}

::EIMO.getRepairRatio <- function( _item )
{
	if (!::EIMO.isDamaged(_item))
	{
		return 100;
	}
	return getRatio(_item, getRepairValueChange, getRepairCost);
}

::EIMO.getRepairProfit <- function( _item )
{
	return getRepairValueChange(_item) - getRepairCost(_item);
}

// Salvage calculations (for Legends)

local function getFinalSalvageValueChange( _item )
{
	return ::EIMO.getMaxSellPrice(_item) * (_item.getCondition() / _item.getConditionMax());
}

local function getSalvageValueChange( _item )
{
	return getValueChange(_item, getFinalSalvageValueChange);
}

local function getSalvageIncome( _item )
{
	if (::EIMO.isLegendArmor(_item))
	{
		return getToolPriceMult() * _item.getRepair();
	}
	return getToolPriceMult() * _item.getCondition();
}

::EIMO.getSalvageRatio <- function( _item )
{
	return getRatio(_item, getSalvageValueChange, getSalvageIncome);
}

// Flag functions
::EIMO.getItemSaleFlag <- function( _item )
{
	return "EIMO.SaleFlag" + _item.getID();
}

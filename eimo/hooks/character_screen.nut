::mods_hookNewObjectOnce("ui/screens/character/character_screen", function(o)
{
	o.m.eimo_RepairTown <- null;
	o.m.eimo_SelectedBrother <- null;

	o.eimo_onFavoriteInventoryItem <- function( _itemID )
	{
		if (!("Assets" in this.World)) return;
		local item = this.World.Assets.getStash().getItemByInstanceID(_itemID).item;
		if (item != null)
		{
			item.eimo_setFavorite(!item.eimo_isFavorite())
			return true;
		}
		return false;
	}

	o.eimo_onRatioRepairButtonClicked <- function()
	{
		local items = this.World.Assets.getStash().getItems();
		foreach( idx, item in items )
		{
			if (item != null && item.getItemType() < this.Const.Items.ItemType.Ammo)
			{
				if (::EIMO.getRepairRatio(item) > ::EIMO.Mod.ModSettings.getSetting(::EIMO.RepairThresholdID).getValue())
				{
					if (::mods_getRegisteredMod("mod_legends") == null)
					{
						item.setToBeRepaired(true);
					}
					else
					{
						item.setToBeRepaired(true, idx)
					}
				}
			}
		}
		this.loadStashList();
	}

	o.eimo_onRatioSalvageButtonClicked <- function()
	{
		local items = this.World.Assets.getStash().getItems();
		foreach (idx, item in items)
		{
			if (item != null && item.canBeSalvaged() && !item.eimo_isFavorite())
			{
				if (::EIMO.getSalvageRatio(item) < ::EIMO.Mod.ModSettings.getSetting(::EIMO.SalvageThresholdID).getValue())
				{
					item.setToBeSalvaged(true, idx);
				}
			}
		}
		this.loadStashList();
	}

	o.eimo_onSetForSaleInventoryItem <- function( _itemID )
	{
		if (!("Assets" in this.World)) return false;
		local item = this.World.Assets.getStash().getItemByInstanceID(_itemID).item;
		if (item != null)
		{
			item.eimo_setForSale(!item.eimo_isSetForSale());
			this.loadStashList();
			return true;
		}
		else
		{
			return false;
		}
	}

	o.eimo_getSelectedBrother <- function()
	{
		return this.m.eimo_SelectedBrother;
	}

	o.eimo_setSelectedBrother <- function( _entityID )
	{
		this.m.eimo_SelectedBrother = _entityID == null ? null : this.Tactical.getEntityByID(_entityID);
	}

	o.eimo_canRepairNearby <- function()
	{
		local settlements = this.World.EntityManager.getSettlements();
		local playerTile = this.World.State.getPlayer().getTile();

		foreach (settlement in settlements)
		{
			if (settlement.getTile().getDistanceTo(playerTile) <= 2 && settlement.isAlliedWithPlayer())
			{
				foreach (building in settlement.eimo_getBuildings())
				{
					if (building.isRepairOffered())
					{
						::EIMO.Mod.Debug.printLog("Can repair nearby");
						this.m.eimo_RepairTown = settlement;
						return true;
					}
				}
			}
		}
		::EIMO.Mod.Debug.printLog("Can't repair nearby");
		this.m.eimo_RepairTown = null;
		return false;
	}

	o.eimo_getRepairData <- function()
	{
		::EIMO.RepairBrothersData.SelectedBrotherPrice = this.eimo_getRepairPriceBrother(this.eimo_getSelectedBrother());
		::EIMO.RepairBrothersData.CompanyPrice = this.eimo_getRepairPriceCompany();

		::EIMO.Mod.Debug.printLog(format("SelectedBrotherPrice: %s, CompanyPrice: %s", ::EIMO.RepairBrothersData.SelectedBrotherPrice.tostring(), ::EIMO.RepairBrothersData.CompanyPrice.tostring()));

		return ::EIMO.RepairBrothersData;
	}

	o.eimo_getRepairPriceCompany <- function()
	{
		local price = 0;
		foreach (brother in this.World.getPlayerRoster().getAll())
		{
			price += this.eimo_getRepairPriceBrother(brother);
		}
		return price;
	}

	o.eimo_getRepairPriceBrother <- function( _brother )
	{
		local price = 0;
		foreach (item in _brother.getItems().getAllItems())
		{
			price += this.eimo_getRepairPriceItem(item);
		}
		return price;
	}

	// Copy of vanilla code, should get checked after updates
	o.eimo_getRepairPriceItem <- function( _item )
	{
		local condition, conditionMax;

		if (::mods_getRegisteredMod("mod_legends") == null)
		{
			conditionMax = _item.getConditionMax();
			condition = _item.getCondition();
		}
		else
		{
			conditionMax = _item.getRepairMax();
			condition = _item.getRepair();
		}

		local price = (conditionMax - condition) * this.Const.World.Assets.CostToRepairPerPoint;
		local value = _item.eimo_getMaxValue() * (1.0 - condition / conditionMax) * 0.2 * this.m.eimo_RepairTown.getPriceMult() * this.Const.Difficulty.SellPriceMult[this.World.Assets.getEconomicDifficulty()];
		return this.Math.max(price, value);
	}

	o.eimo_paidRepairBrother <- function( _brother )
	{
		local price = this.eimo_getRepairPriceBrother(_brother);
		foreach(item in _brother.getItems().getAllItems())
		{
			this.eimo_paidRepairItem(item);
		}
		this.Sound.play("sounds/ambience/buildings/blacksmith_hammering_0" + this.Math.rand(0, 6) + ".wav", 1.0);
		this.World.Assets.addMoney(-price);
	}

	o.eimo_paidRepairItem <- function( _item )
	{
		if (::mods_getRegisteredMod("mod_legends") == null)
		{
			_item.setCondition(_item.getConditionMax());
			_item.setToBeRepaired(false);
		}
		else
		{
			_item.setCondition(_item.getRepairMax());
			_item.setToBeRepaired(false, 0);
		}
		this.World.Statistics.getFlags().increment("ItemsRepaired");
	}

	o.eimo_paidRepairBrotherFromJS <- function()
	{
		this.eimo_paidRepairBrother(this.eimo_getSelectedBrother());
		this.loadData();
	}

	o.eimo_paidRepairCompanyFromJS <- function()
	{
		foreach (brother in this.World.getPlayerRoster().getAll())
		{
			this.eimo_paidRepairBrother(brother);
		}
		this.loadData();
	}

	o.eimo_getSettings <- function()
	{
		::EIMO.RepairBrothersData.CanRepairNearby = this.eimo_canRepairNearby();
		//this.Const.EIMO.characterScreen = this.weakref();
		local ret = {
			legends = ::mods_getRegisteredMod("mod_legends") != null,
			canRepair = ::EIMO.RepairBrothersData.CanRepairNearby
		};
		return ret;
	}
});

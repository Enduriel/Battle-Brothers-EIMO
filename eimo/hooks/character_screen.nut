::Hooks.addFields(::EIMO.ID, "scripts/ui/screens/character/character_screen", {
	eimo_RepairTown = null,
	eimo_SelectedBrother = null
});

::Hooks.addNewFunctions(::EIMO.ID, "scripts/ui/screens/character/character_screen", {
	function eimo_onFavoriteInventoryItem( _itemID )
	{
		if (!("Assets" in ::World)) return;
		local item = ::World.Assets.getStash().getItemByInstanceID(_itemID).item;
		if (item != null)
		{
			item.eimo_setFavorite(!item.eimo_isFavorite())
			return true;
		}
		return false;
	}

	function eimo_onRatioRepairButtonClicked()
	{
		local items = ::World.Assets.getStash().getItems();
		foreach( idx, item in items )
		{
			if (item != null && item.getItemType() < ::Const.Items.ItemType.Ammo)
			{
				if (::EIMO.getRepairRatio(item) > ::EIMO.Mod.ModSettings.getSetting(::EIMO.RepairThresholdID).getValue())
				{
					if (::Hooks.hasMod("mod_legends"))
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

	function eimo_onRatioSalvageButtonClicked()
	{
		local items = ::World.Assets.getStash().getItems();
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

	function eimo_onSetForSaleInventoryItem( _itemID )
	{
		if (!("Assets" in ::World)) return null;
		local item = ::World.Assets.getStash().getItemByInstanceID(_itemID).item;

		if (item != null)
		{
			item.eimo_setForSale(!item.eimo_isSetForSale());
			local id = item.getID();
			local items = ::World.Assets.getStash().getItems();
			local retItems = [];
			foreach (idx, item in items)
				if (item != null && item.eimo_isSetForSale())
					retItems.push(idx);
			return retItems;
		}
		else
		{
			return null;
		}
	}

	function eimo_onFavoriteItemsWithID( _instanceID )
	{
		if (!("Assets" in ::World)) return null;
		local item = ::World.Assets.getStash().getItemByInstanceID(_instanceID).item;

		if (item != null)
		{
			item.eimo_setIDFavorite(!item.eimo_isIDFavorite());
			local id = item.getID();
			local items = ::World.Assets.getStash().getItems();
			local retItems = [];
			foreach (idx, item in items)
				if (item != null && item.eimo_isIDFavorite())
					retItems.push(idx);
			return retItems;
		}
		else
		{
			return null;
		}
	}

	function eimo_getSelectedBrother()
	{
		return this.m.eimo_SelectedBrother;
	}

	function eimo_setSelectedBrother( _entityID )
	{
		this.m.eimo_SelectedBrother = _entityID == null ? null : this.Tactical.getEntityByID(_entityID);
	}

	function eimo_canRepairNearby()
	{
		local settlements = ::World.EntityManager.getSettlements();
		local playerTile = ::World.State.getPlayer().getTile();

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

	function eimo_getRepairData()
	{
		::EIMO.RepairBrothersData.SelectedBrotherPrice = this.eimo_getRepairPriceBrother(this.eimo_getSelectedBrother());
		::EIMO.RepairBrothersData.CompanyPrice = this.eimo_getRepairPriceCompany();

		::EIMO.Mod.Debug.printLog(format("SelectedBrotherPrice: %s, CompanyPrice: %s", ::EIMO.RepairBrothersData.SelectedBrotherPrice.tostring(), ::EIMO.RepairBrothersData.CompanyPrice.tostring()));

		return ::EIMO.RepairBrothersData;
	}

	function eimo_getRepairPriceCompany()
	{
		local price = 0;
		foreach (brother in ::World.getPlayerRoster().getAll())
		{
			price += this.eimo_getRepairPriceBrother(brother);
		}
		return price;
	}

	function eimo_getRepairPriceBrother( _brother )
	{
		local price = 0;
		foreach (item in _brother.getItems().getAllItems())
		{
			price += this.eimo_getRepairPriceItem(item);
		}
		return price;
	}

	// Copy of vanilla code, should get checked after updates
	function eimo_getRepairPriceItem( _item )
	{
		local condition, conditionMax;

		if (::Hooks.hasMod("mod_legends"))
		{
			conditionMax = _item.getConditionMax();
			condition = _item.getCondition();
		}
		else
		{
			conditionMax = _item.getRepairMax();
			condition = _item.getRepair();
		}

		local price = (conditionMax - condition) * ::Const.World.Assets.CostToRepairPerPoint;
		local value = _item.eimo_getMaxValue() * (1.0 - condition / conditionMax) * 0.2 * this.m.eimo_RepairTown.getPriceMult() * ::Const.Difficulty.SellPriceMult[::World.Assets.getEconomicDifficulty()];
		return ::Math.max(price, value);
	}

	function eimo_paidRepairBrother( _brother )
	{
		local price = this.eimo_getRepairPriceBrother(_brother);
		foreach(item in _brother.getItems().getAllItems())
		{
			this.eimo_paidRepairItem(item);
		}
		::Sound.play("sounds/ambience/buildings/blacksmith_hammering_0" + ::Math.rand(0, 6) + ".wav", 1.0);
		::World.Assets.addMoney(-price);
	}

	function eimo_paidRepairItem( _item )
	{
		if (::Hooks.hasMod("mod_legends"))
		{
			_item.setCondition(_item.getConditionMax());
			_item.setToBeRepaired(false);
		}
		else
		{
			_item.setCondition(_item.getRepairMax());
			_item.setToBeRepaired(false, 0);
		}
		::World.Statistics.getFlags().increment("ItemsRepaired");
	}

	function eimo_paidRepairBrotherFromJS()
	{
		this.eimo_paidRepairBrother(this.eimo_getSelectedBrother());
		this.loadData();
	}

	function eimo_paidRepairCompanyFromJS()
	{
		foreach (brother in ::World.getPlayerRoster().getAll())
		{
			this.eimo_paidRepairBrother(brother);
		}
		this.loadData();
	}
})

::Hooks.wrapFunctions(::EIMO.ID, "scripts/ui/screens/character/character_screen", {
	function queryData( _originalFunction ) {
		return function() {
			::EIMO.RepairBrothersData.CanRepairNearby = ::Tactical.isActive() ? false : this.eimo_canRepairNearby();
			local ret = _originalFunction();
			ret.EIMO <- {
				legends = ::Hooks.hasMod("mod_legends"),
				canRepair = ::EIMO.RepairBrothersData.CanRepairNearby
			}
			return ret;
		}
	}
})

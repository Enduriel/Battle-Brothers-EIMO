::mods_hookNewObjectOnce("ui/screens/character/character_screen", function(o) {

	o.m.EIMO <- {
		RepairTown = null,
		SelectedBrother = null
	}

	o.EIMO <- {
		function onFavoriteInventoryItem( _itemID )
		{
			if (!("Assets" in this.World)) return;
			local item = this.World.Assets.getStash().getItemByInstanceID(_itemID).item;
			item.EIMO.setFavorite(!item.EIMO.isFavorite())
			return true;
		}

		function onRepairAllButtonClicked()
		{
			if (!("Assets" in this.World)) return;
			local items = this.World.Assets.getStash().getItems();
			foreach( item in items )
			{
				if (item != null && item.getItemType() < this.Const.Items.ItemType.Ammo)
				{
					local ratio = ::EIMO.getRepairRatio(item);
					if (ratio > ::getModSetting(::EIMO.ID, ::EIMO.RepairThresholdID))
					{
						item.setToBeRepaired(true);
					}
				}
			}
			this.loadStashList();
		}

		function onSetForSaleInventoryItem( _itemID )
		{
			if (!("Assets" in this.World)) return false;
			local item = this.World.Assets.getStash().getItemByInstanceID(_itemID).item;
			if (item != null)
			{
				item.setForSale(!item.isSetForSale());
				this.loadStashList();
				return true;
			}
			else
			{
				return false;
			}
		}

		function getSettings()
		{
			//TODO
		}

		function getSelectedBrother()
		{
			return this.m.EIMO.SelectedBrother;
		}

		function setSelectedBrother( _entityID )
		{
			this.m.EIMO.SelectedBrother = _entityID == null ? null : this.Tactical.getEntityByID(_entityID);
		}

		function canRepairNearby()
		{
			local settlements = this.World.EntityManager.getSettlements();
			local playerTile = this.World.State.getPlayer().getTile();

			foreach (settlement in settlements)
			{
				if (settlement.getTile().getDistanceTo(playerTile) <= 2 && settlement.isAlliedWithPlayer())
				{
					foreach (building in settlement.EIMO.getBuildings())
					{
						if (building.isRepairOffered())
						{
							this.m.EIMO.RepairTown = settlement;
							return true;
						}
					}
				}
			}

			this.m.EIMO.RepairTown = null;
			return false;
		}

		function getRepairData()
		{
			// TODO Might need updating more often (eg when brother has equipment added/removed)
			::EIMO.repairBrothersData.SelectedBrotherPrice = this.getRepairPriceBrother(this.getSelectedBrother());
			::EIMO.repairBrothersData.CompanyPrice = this.getRepairPriceCompany();

			return ::EIMO.repairBrothersData;
		}

		function getRepairPriceCompany()
		{
			local price = 0;
			foreach (brother in this.World.getPlayerRoster().getAll())
			{
				price += this.getRepairPriceBrother(brother);
			}
			return price;
		}

		function getRepairPriceBrother( _brother, _repairTown )
		{
			local price = 0;
			foreach (item in _brother.getItems().getAllItems())
			{
				price += this.getRepairPriceItem(item);
			}
			return price;
		}

		// Copy of vanilla code, should get checked after updates
		function getRepairPriceItem( _item )
		{
			local price = (_item.getConditionMax() - _item.getCondition()) * this.Const.World.Assets.CostToRepairPerPoint;
			local value = _item.m.Value * (1.0 - _item.getCondition() / _item.getConditionMax()) * 0.2 * this.m.EIMO.RepairTown.getPriceMult() * this.Const.Difficulty.SellPriceMult[this.World.Assets.getEconomicDifficulty()];
			return this.Math.max(price, value);
		}

		function paidRepairBrother( _brother )
		{
			local price = this.getRepairPriceBrother(_brother);
			foreach(item in _brother.getItems().getAllItems())
			{
				this.paidRepairItem(item);
			}
			this.Sound.play("sounds/ambience/buildings/blacksmith_hammering_0" + this.Math.rand(0, 6) + ".wav", 1.0);
			this.World.Assets.addMoney(-price);
		}

		function paidRepairItem( _item )
		{
			_item.setCondition(_item.getConditionMax());
			_item.setToBeRepaired(false);	//Legends may need to remove from a queue?
			this.World.Statistics.getFlags().increment("ItemsRepaired");
		}

		function jsPaidRepairBrother()
		{
			this.paidRepairBrother(this.getSelectedBrother());
			this.loadData();
		}

		function jsPaidRepairCompany()
		{
			foreach (brother in this.World.getPlayerRoster().getAll())
			{
				paidRepairBrother(brother);
			}
			this.loadData();
		}

		function getSettings()
		{
			//this.Const.EIMO.characterScreen = this.weakref();
			local ret = {
				isVisible = getModSetting(::EIMO.ID, ::EIMO.InventoryAddonsID),
				canRepair = this.canRepairNearby()
			};
			return ret;
		}

	};.setdelegate(o);
});

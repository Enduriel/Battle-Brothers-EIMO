this.getroottable().Const.EIMO.hookCharacterScreen <- function()
{
	::mods_hookNewObjectOnce("ui/screens/character/character_screen", function(o) {

		o.m.RepairTown <- null;

		o.onFavoriteInventoryItem <- function(itemID)
		{
			if (!("Assets" in this.World)) return;
			local item = this.World.Assets.getStash().getItemByInstanceID(itemID).item;			
			item.setFavorite(!item.isFavorite())

			return true;
		}
		
		o.onRepairAllButtonClicked <- function()
		{
			if (!("Assets" in this.World)) return;
			local items = this.World.Assets.getStash().getItems();
			foreach( i, item in items )
			{
				if (item != null && item.getItemType() < this.Const.Items.ItemType.Ammo)
				{
					local dratio = this.Const.EIMO.getDratio(item);
					if (dratio > this.Const.EIMO.RepairThreshold)
					{
						item.setToBeRepaired(true, i);
					}
				}
			}
			this.loadStashList();
		}

		o.EIMOonSalvageAllButtonClicked <- function()
		{
			local items = this.World.Assets.getStash().getItems();
			foreach (i, item in items)
			{
				if (item != null && item.canBeSalvaged() && !item.isFavorite())
				{
					if (this.Const.EIMO.getSratio(item) < this.Const.EIMO.SalvageThreshold)
					{
						item.setToBeSalvaged(true, i);
					}
				}
			}
			this.loadStashList();
		}

		o.onSetForSaleInventoryItem <- function(data)
		{
			if (!("Assets" in this.World)) return;
			local item = this.World.Assets.getStash().getItemByInstanceID(data).item;
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

		o.ChangeVisibilityButtonClicked <- function ()
		{
			switch (this.Const.EIMO.visibilityLevel) 
			{
			    case 0: case 1:
			        this.Const.EIMO.visibilityLevel++;
			        break;
			   	case 2: default:
			   		this.Const.EIMO.visibilityLevel = 0;
			}
			this.loadStashList();
			return this.Const.EIMO.visibilityLevel;
		}


		o.EIMOgetVisibilityLevel <- function ()
		{
		  	return this.Const.EIMO.visibilityLevel;
		}

		o.EIMOgetSettings <- function()
		{
			this.Const.EIMO.characterScreen = this.weakref();
			local ret = {
				repairThreshold = this.Const.EIMO.RepairThreshold,
				waitThreshold = this.Const.EIMO.SellThreshold,
				salvageThreshold = this.Const.EIMO.SalvageThreshold,
				isVisible = this.Const.EIMO.ShowSettings,
				canRepair = this.EIMOcanRepair() != null
			}
			return ret;
		}

		o.EIMOsetSettings <- function (_data)
		{
			this.Const.EIMO.RepairThreshold = _data.repairThreshold;
			this.Const.EIMO.SellThreshold = _data.waitThreshold;
			this.Const.EIMO.SalvageThreshold = _data.salvageThreshold;
		}

		o.EIMOsetVisible <- function (_data)
		{
			this.Const.EIMO.ShowSettings = _data;
		}

		o.m.EIMOSelectedBrother <- null;

		o.EIMOgetSelectedBrother <- @() this.m.EIMOSelectedBrother

		o.EIMOsetSelectedBrother <- function (_entityID)
		{
			this.m.EIMOSelectedBrother = _entityID == null ? null : this.Tactical.getEntityByID(_entityID);
		}

		o.EIMOcanRepair <- function ()
		{
			local settlements = this.World.EntityManager.getSettlements();
			local playerTile = this.World.State.getPlayer().getTile();
			foreach(s in settlements)
			{
				if (s.getTile().getDistanceTo(playerTile) <= 2 && s.isAlliedWithPlayer()) //Not sure about the isAlliedWithPlayer part
				{
					foreach(building in s.getBuildings())
					{
						if (building.isRepairOffered()) 
						{
							this.m.RepairTown = s;
							return s;
						}
					}
				}
			}
			this.m.RepairTown = null;
			return null;
		}

		o.EIMOgetRepairButtonData <- function ()
		{
			local broPrice = this.EIMOgetRepairPriceBrother(this.EIMOgetSelectedBrother());
			local companyPrice = this.EIMOgetRepairPriceCompany();

			local ret = {
				canRepairBrother = broPrice != null && broPrice != 0,
				canRepairCompany = companyPrice != null && companyPrice != 0
			};
			return ret;
		}

		o.EIMOgetRepairPriceCompany <- function ()
		{
			local price = 0;
			foreach(brother in this.World.getPlayerRoster().getAll())
			{
				local val = this.EIMOgetRepairPriceBrother(brother);
				if (val == null) return null;
				price += val;
			}
			return price;
		}

		o.EIMOgetRepairPriceBrother <- function (_brother)
		{
			local price = 0;
			
			foreach(item in _brother.getItems().getAllItems())
			{
				local val = this.EIMOgetRepairPrice(item);
				if (val == null) return null;
				price += val;
			}
			return price;
		}

		o.EIMOgetRepairPrice <- function (_item) // Legends needs to use repairmax not conditionmax
		{
			local town = this.m.RepairTown;
			if (town == null) return null;

			local condition;
			local conditionMax;
			if (::mods_isClass(_item, "legend_armor") != null || ::mods_isClass(_item, "legend_helmet") != null)
			{
				condition = _item.getRepair();
				conditionMax = _item.getRepairMax();
			}
			else
			{
				condition = _item.getCondition();
				conditionMax = _item.getConditionMax();
			}

			local price = (conditionMax - condition) * this.Const.World.Assets.CostToRepairPerPoint;
			local value = _item.getValue() * (1.0 - condition / conditionMax) * 0.2 * town.getPriceMult() * this.Const.Difficulty.SellPriceMult[this.World.Assets.getEconomicDifficulty()];
			return this.Math.max(price, value);
		}

		//Assumes that checks have been made for price etc
		o.EIMOpaidRepairBrother <- function (_brother)
		{
			local price = this.EIMOgetRepairPriceBrother(_brother);
			foreach(item in _brother.getItems().getAllItems())
			{
				this.EIMOpaidRepair(item);
			}
			this.Sound.play("sounds/ambience/buildings/blacksmith_hammering_0" + this.Math.rand(0, 6) + ".wav", 1.0);
			this.World.Assets.addMoney(-price);
		}

		o.EIMOpaidRepair <- function (_item)
		{
			if (::mods_isClass(_item, "legend_armor") != null || ::mods_isClass(_item, "legend_helmet") != null)
			{
				_item.setCondition(_item.getRepairMax());
			}
			else
			{
				_item.setCondition(_item.getConditionMax());
			}
			_item.setToBeRepaired(false, 0);	//Legends may need to remove from a queue?
			this.World.Statistics.getFlags().increment("ItemsRepaired");
		}

		o.EIMOjspaidRepairBrother <- function ()
		{
			this.EIMOpaidRepairBrother(this.EIMOgetSelectedBrother());
			this.loadData();
		}

		o.EIMOjspaidRepairCompany <- function ()
		{
			foreach(brother in this.World.getPlayerRoster().getAll())
			{
				this.EIMOpaidRepairBrother(brother);
			}
			this.loadData();
		}
	});
}

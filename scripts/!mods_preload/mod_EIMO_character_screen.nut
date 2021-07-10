this.getroottable().Const.EIMO.hookCharacterScreen <- function()
{
	::mods_hookNewObjectOnce("ui/screens/character/character_screen", function(o) {
	  
		o.onFavoriteInventoryItem <- function(itemID)
		{
			if (!("Assets" in this.World)) return;
			local item = this.World.Assets.getStash().getItemByInstanceID(itemID).item;
			
			if (item.m.isFavorite)
			{
				item.m.isFavorite = false;
			}
			else
			{
				item.m.isFavorite = true;
			}
			return true;
		}
		
		o.onRepairAllButtonClicked <- function()
		{
			if (!("Assets" in this.World)) return;
			local items = this.World.Assets.getStash().getItems();
			foreach( item in items )
			{
				if (item != null && item.getItemType() < this.Const.Items.ItemType.Ammo)
				{
					local dratio = this.Const.EIMO.getDratio(item);
					if (dratio > this.Const.EIMO.repairThreshold)
					{
						item.setToBeRepaired(true);
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
				if (!this.World.Flags.has(this.Const.EIMO.getItemSaleFlag(item)) || this.World.Flags.get(this.Const.EIMO.getItemSaleFlag(item)) == 0)
				{
					this.World.Flags.set(this.Const.EIMO.getItemSaleFlag(item), 1);
					this.loadStashList();
					return true;
				}
				else if (item != null && this.World.Flags.get(this.Const.EIMO.getItemSaleFlag(item)) == 1)
				{
					this.World.Flags.set(this.Const.EIMO.getItemSaleFlag(item), 0);
					this.loadStashList();
					return true;
				}
			}
			else
			{
				return false;
			}
		}

		o.EIMOonChangeVisibilityButtonClicked <- function ()
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
			local ret = {
				repairThreshold = this.Const.EIMO.repairThreshold,
				waitThreshold = this.Const.EIMO.sellThreshold
			}
			return ret;
		}

		o.EIMOsetSettings <- function (_data)
		{
			this.Const.EIMO.repairThreshold = _data.repairThreshold;
			this.Const.EIMO.sellThreshold = _data.waitThreshold;
		}
	});
}
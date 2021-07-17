this.getroottable().Const.EIMO.hookWorldState <- function()
{
	::mods_hookNewObjectOnce("states/world_state", function ( o )
	{
		local onSerialize = o.onSerialize;
		o.onSerialize = function( _out )
		{
			//this.logInfo("Serializing");
			local items = this.m.Assets.getStash().getItems();
			
			if(this.Const.EIMO.visibilityLevel != 0)
			{
				this.World.Flags.set(this.Const.EIMO.getVisibilityLevelFlag(), visibilityLevel);
			}
			else if (this.World.Flags.has(this.Const.EIMO.getVisibilityLevelFlag()))
			{
				this.World.Flags.remove(this.Const.EIMO.getVisibilityLevelFlag());
			}

			this.World.Flags.set(this.Const.EIMO.getRepairThresholdFlag(), this.Const.EIMO.RepairThreshold)
			this.World.Flags.set(this.Const.EIMO.getSellThresholdFlag(), this.Const.EIMO.SellThreshold)
			this.World.Flags.set(this.Const.EIMO.getShowSettingsFlag(), this.Const.EIMO.ShowSettings)

			for( local i = 0; i != items.len(); i = ++i )
			{
				local item = items[i];
				if (item != null && item.isFavorite() )
				{
					this.World.Flags.set(this.Const.EIMO.getStashIndexFlag(i), 1);
					//this.logInfo("item: " + item.getID() + " at index "+ i +" saved as favorite.");
				}
				else if (this.World.Flags.has(this.Const.EIMO.getStashIndexFlag(i)))
				{
					this.World.Flags.remove(this.Const.EIMO.getStashIndexFlag(i));
				}
			}
			onSerialize( _out );
			foreach(bro in this.World.getPlayerRoster().getAll())
			{
				foreach (item in bro.getItems().getAllItems())
				{
					if(item != null)
					{
						if(bro.getFlags().has("EIMO" + item.getCurrentSlotType())) bro.getFlags().remove("EIMO" + item.getCurrentSlotType());
					}
				}
			}
		}

		local onBeforeSerialize = o.onBeforeSerialize;
		o.onBeforeSerialize = function ( _out )
		{
			foreach(bro in this.World.getPlayerRoster().getAll())
			{
				local bagslot = 0;
				foreach (item in bro.getItems().getAllItems())
				{
					if(item != null)
					{
						if(item.getCurrentSlotType() == this.Const.ItemSlot.Bag) bagslot++;
						if(item.isFavorite())
						{
							bro.getFlags().add(this.Const.EIMO.getBroItemSlotFlag(item, bagslot));
						}
						else if(bro.getFlags().has(this.Const.EIMO.getBroItemSlotFlag(item, bagslot)))
						{
							bro.getFlags().remove(this.Const.EIMO.getBroItemSlotFlag(item, bagslot));
						}
					}
				}
			}
			onBeforeSerialize( _out );
		}

		local onDeserialize = o.onDeserialize;
		o.onDeserialize = function( _in )
		{	
			//this.logInfo("Deserializing");
			onDeserialize( _in );
			local items = this.m.Assets.getStash().getItems();
			
			if(this.World.Flags.has(this.Const.EIMO.getVisibilityLevelFlag()) && this.World.Flags.get(this.Const.EIMO.getVisibilityLevelFlag()) >= 0)
			{
				this.Const.EIMO.visibilityLevel = this.World.Flags.get(this.Const.EIMO.getVisibilityLevelFlag());
			}
			else
			{
				this.Const.EIMO.visibilityLevel = 0;
			}

			if(this.World.Flags.has(this.Const.EIMO.getRepairThresholdFlag())) this.Const.EIMO.RepairThreshold = this.World.Flags.get(this.Const.EIMO.getRepairThresholdFlag())
			else this.Const.EIMO.RepairThreshold = 125;
			if(this.World.Flags.has(this.Const.EIMO.getSellThresholdFlag())) this.Const.EIMO.SellThreshold = this.World.Flags.get(this.Const.EIMO.getSellThresholdFlag())
			else this.Const.EIMO.SellThreshold = 150;
			if(this.World.Flags.has(this.Const.EIMO.getShowSettingsFlag())) this.Const.EIMO.ShowSettings = this.World.Flags.get(this.Const.EIMO.getShowSettingsFlag())
			else this.Const.EIMO.ShowSettings = true;

			for( local i = 0; i != items.len(); i = ++i )
			{
				local item = items[i];
				
				if (item == null || !this.World.Flags.has( this.Const.EIMO.getStashIndexFlag(i) ) || this.World.Flags.get( this.Const.EIMO.getStashIndexFlag(i) ) == 0)
				{
				}
				else if (this.World.Flags.get(this.Const.EIMO.getStashIndexFlag(i)) == 1)
				{
					item.setFavorite(true);
					this.World.Flags.remove(this.Const.EIMO.getStashIndexFlag(i));
				}
			}

			foreach(bro in this.World.getPlayerRoster().getAll())
			{
				local bagslot = 0;
				foreach (item in bro.getItems().getAllItems())
				{
					if(item != null)
					{
						if(item.getCurrentSlotType() == this.Const.ItemSlot.Bag) bagslot++;
						if(bro.getFlags().has(this.Const.EIMO.getBroItemSlotFlag(item, bagslot)))
						{
							item.setFavorite(true);
							bro.getFlags().remove(this.Const.EIMO.getBroItemSlotFlag(item, bagslot))
						}
					}
				}
			}
		}
	});
}
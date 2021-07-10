this.getroottable().Const.EIMO.hookWorldState <- function()
{
	::mods_hookNewObjectOnce("states/world_state", function ( o )
	{
		local onSerialize = o.onSerialize;
		o.onSerialize = function( _out )
		{
			//this.logInfo("Serializing");
			local items = this.m.Assets.getStash().getItems();
			
			if(visibilityLevel != 0)
			{
				this.World.Flags.set(getVisibilityLevelFlag(), visibilityLevel);
			}
			else if (this.World.Flags.has(getVisibilityLevelFlag()))
			{
				this.World.Flags.remove(getVisibilityLevelFlag());
			}

			for( local i = 0; i != items.len(); i = ++i )
			{
				local item = items[i];
				if (item != null && item.m.isFavorite )
				{
					this.World.Flags.set(getStashIndexFlag(i), 1);
					//this.logInfo("item: " + item.getID() + " at index "+ i +" saved as favorite.");
				}
				else if (this.World.Flags.has(getStashIndexFlag(i)))
				{
					this.World.Flags.remove(getStashIndexFlag(i));
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
				foreach (item in bro.getItems().getAllItems())
				{
					if(item != null)
					{
						if(item.m.isFavorite)
						{
							bro.getFlags().add("EIMO" + item.getCurrentSlotType());
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
			
			if(this.World.Flags.has(getVisibilityLevelFlag()) && this.World.Flags.get(getVisibilityLevelFlag()) >= 0)
			{
				visibilityLevel = this.World.Flags.get(getVisibilityLevelFlag());
			}
			else
			{
				visibilityLevel = 0;
			}

			for( local i = 0; i != items.len(); i = ++i )
			{
				local item = items[i];
				
				if (item == null || !this.World.Flags.has( getStashIndexFlag(i) ) || this.World.Flags.get( getStashIndexFlag(i) ) == 0)
				{
				}
				else if (this.World.Flags.get(getStashIndexFlag(i)) == 1)
				{
					item.m.isFavorite = true;
					this.World.Flags.remove(getStashIndexFlag(i));
				}
			}

			foreach(bro in this.World.getPlayerRoster().getAll())
			{
				foreach (item in bro.getItems().getAllItems())
				{
					if(item != null)
					{
						if(bro.getFlags().has("EIMO" + item.getCurrentSlotType()))
						{
							item.m.isFavorite = true;
							bro.getFlags().remove("EIMO" + item.getCurrentSlotType())
						}
					}
				}
			}
		}
	});
}
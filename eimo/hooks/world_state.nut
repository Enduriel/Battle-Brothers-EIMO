::mods_hookExactClass("states/world_state", function ( o )
{
	local function getBroItemSlotFlag( _item, _bagslot )
	{
		if (_item.getCurrentSlotType() == ::Const.ItemSlot.Bag) return "EIMO." + ::Const.ItemSlot.Bag + "." + _bagslot;
		else return "EIMO." + _item.getCurrentSlotType();
	}

	local function getStashIndexFavoriteFlag( _idx )
	{
		return "EIMO." + _idx + ".Fav";
	}

	local onSerialize = o.onSerialize;
	o.onSerialize = function( _out )
	{
		local items = this.m.Assets.getStash().getItems();

		for( local i = 0; i != items.len(); i = ++i )
		{
			local item = items[i];
			if (item != null && item.eimo_isFavorite() )
			{
				::World.Flags.add(getStashIndexFavoriteFlag(i));
				::EIMO.Mod.Debug.printLog(format("item %s at index %s saved as favorite", item.getID(), i.tostring()))
			}
		}
		onSerialize( _out );
		foreach(bro in ::World.getPlayerRoster().getAll())
		{
			foreach (item in bro.getItems().getAllItems())
			{
				if (item != null)
				{
					if (bro.getFlags().has("EIMO" + item.getCurrentSlotType())) bro.getFlags().remove("EIMO" + item.getCurrentSlotType());
				}
			}
		}
		for (local i = 0; i < items.len(); ++i)
		{
			if (::World.Flags.has(getStashIndexFavoriteFlag(i)))
			{
				::World.Flags.remove(getStashIndexFavoriteFlag(i));
			}
		}
	}

	local onBeforeSerialize = o.onBeforeSerialize;
	o.onBeforeSerialize = function ( _out )
	{
		foreach(bro in ::World.getPlayerRoster().getAll())
		{
			local bagslot = 0;
			foreach (item in bro.getItems().getAllItems())
			{
				if (item != null)
				{
					// I think this should get tested, I'm suprised it works if it does
					if (item.getCurrentSlotType() == ::Const.ItemSlot.Bag) bagslot++;
					if (item.eimo_isFavorite())
					{
						::EIMO.Mod.Debug.printLog(format("item %s in slot %s on bro %s saved as favorite", item.getID(), item.getCurrentSlotType().tostring(), bro.getName()));
						bro.getFlags().add(getBroItemSlotFlag(item, bagslot));
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

		for( local i = 0; i != items.len(); i = ++i )
		{
			local item = items[i];

			if (item != null && ::World.Flags.has(getStashIndexFavoriteFlag(i)))
			{
				item.eimo_setFavorite(true);
				::World.Flags.remove(getStashIndexFavoriteFlag(i));
			}
		}

		foreach(bro in ::World.getPlayerRoster().getAll())
		{
			local bagslot = 0;
			foreach (item in bro.getItems().getAllItems())
			{
				if (item != null)
				{
					if (item.getCurrentSlotType() == ::Const.ItemSlot.Bag) bagslot++;
					if (bro.getFlags().has(getBroItemSlotFlag(item, bagslot)))
					{
						item.eimo_setFavorite(true);
						bro.getFlags().remove(getBroItemSlotFlag(item, bagslot))
					}
				}
			}
		}
	}
});

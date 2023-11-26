local function getBroItemSlotFlag( _item, _bagslot )
{
	if (_item.getCurrentSlotType() == ::Const.ItemSlot.Bag) return "EIMO." + ::Const.ItemSlot.Bag + "." + _bagslot;
	else return "EIMO." + _item.getCurrentSlotType();
}

local function getStashIndexFavoriteFlag( _idx )
{
	return "EIMO." + _idx + ".Fav";
}
::EIMO.HookMod.hook("scripts/states/world_state", function(q) {
	q.onSerialize = @(__original) function() {
		local favoritedItems = [];
		foreach (idx, item in this.m.Assets.getStash().getItems())
			if (item != null && item.eimo_isFavorite())
				favoritedItems.push(idx);
		::EIMO.Mod.Serialization.flagSerialize("Favs", favoritedItems);
		::EIMO.Mod.Serialization.flagSerialize("FavIDs", ::EIMO.FavoriteIDs);
		::EIMO.Mod.Serialization.flagSerialize("ForSaleIDs", ::EIMO.ForSaleIDs);
		return __original( _out );
	}

	q.onBeforeDeserialize = @(__original) function( _in ) {
		::EIMO.FavoriteIDs.clear();
		::EIMO.ForSaleIDs.clear();
		return __original(_in);
	}

	q.onDeserialize = @(__original) function( _in ) {
		__original( _in );

		if (::EIMO.Mod.Serialization.isSavedVersionAtLeast("9.1.0", _in.getMetaData()))
		{
			local favoriteStashIndices = ::EIMO.Mod.Serialization.flagDeserialize("Favs", []);
			local items = this.m.Assets.getStash().getItems();
			foreach (idx in favoriteStashIndices)
				items[idx].eimo_setFavorite(true);
			::EIMO.Mod.Serialization.flagDeserialize("FavIDs", {}, ::EIMO.FavoriteIDs);
			::EIMO.Mod.Serialization.flagDeserialize("ForSaleIDs", {}, ::EIMO.ForSaleIDs);
		}
		else
		{
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
	}

	q.onFinish = @(__original) function() {
		::EIMO.FavoriteIDs.clear();
		::EIMO.ForSaleIDs.clear();
		return __original();
	}
})

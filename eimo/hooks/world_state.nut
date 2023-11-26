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
	q.onSerialize = @(__original) function(_out) {
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
		local favoriteStashIndices = ::EIMO.Mod.Serialization.flagDeserialize("Favs", []);
		local items = this.m.Assets.getStash().getItems();
		foreach (idx in favoriteStashIndices)
			items[idx].eimo_setFavorite(true);
		::EIMO.Mod.Serialization.flagDeserialize("FavIDs", {}, ::EIMO.FavoriteIDs);
		::EIMO.Mod.Serialization.flagDeserialize("ForSaleIDs", {}, ::EIMO.ForSaleIDs);
	}

	q.onFinish = @(__original) function() {
		::EIMO.FavoriteIDs.clear();
		::EIMO.ForSaleIDs.clear();
		return __original();
	}
})

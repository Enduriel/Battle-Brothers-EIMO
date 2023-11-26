::EIMO.HookMod.hook("scripts/entity/tactical/player", function(q){
	q.onSerialize = @( __original ) function() {
		local favorites = [];
		foreach (i, itemSlot in this.getItems().m.Items)
		{
			foreach (j, item in itemSlot)
			{
				if (item != null && item != -1 && item.eimo_isFavorite()) favorites.push([i,j]);
			}
		}
		::EIMO.Mod.Serialization.flagSerialize("Favs", favorites, this.getFlags())
		return __original(_out);
	}

	q.onDeserialize = @( __original ) function() {
		__original(_in);
		if (::EIMO.Mod.Serialization.isSavedVersionAtLeast("9.1.0", _in.getMetaData()))
		{
			local favorites = ::EIMO.Mod.Serialization.flagDeserialize("Favs", [], null, this.getFlags());
			local items = this.getItems().m.Items;
			foreach (pair in favorites)
			{
				items[pair[0]][pair[1]].eimo_setFavorite(true);
			}
		}
	}
})

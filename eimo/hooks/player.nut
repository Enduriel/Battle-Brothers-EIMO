::mods_hookExactClass("entity/tactical/player", function (o)
{
	local onSerialize = o.onSerialize;
	o.onSerialize = function( _out )
	{
		local favorites = [];
		foreach (i, itemSlot in this.getItems().m.Items)
		{
			foreach (j, item in itemSlot)
			{
				if (item != null && item != -1 && item.eimo_isFavorite()) favorites.push([i,j]);
			}
		}
		::EIMO.Mod.Serialization.flagSerialize("Favs", favorites, this.getFlags())
		onSerialize(_out);
	}

	local onDeserialize = o.onDeserialize;
	o.onDeserialize = function( _in )
	{
		onDeserialize(_in);
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
});

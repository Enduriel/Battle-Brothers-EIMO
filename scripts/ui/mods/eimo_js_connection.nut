this.eimo_js_connection <- ::inherit("scripts/mods/msu/js_connection", {
	m = {
		ID = "EIMOConnection"
	},

	function onSetForSaleItemID( _instanceID )
	{
		if (!("Assets" in ::World)) return null;
		local item = ::World.Assets.getStash().getItemByInstanceID(_instanceID).item;

		if (item != null)
		{
			item.eimo_setForSale(!item.eimo_isSetForSale());
			local id = item.getID();
			return ::World.Assets.getStash().getItems().filter(@(_, _i) _i != null && _i.getID() == id).map(@(_i) ::UIDataHelper.convertItemToUIData(_i, false));
		}
		return null;
	}

	function onFavoriteItem( _instanceID )
	{
		if (!("Assets" in ::World)) return null;
		local item = ::World.Assets.getStash().getItemByInstanceID(_instanceID).item;

		if (item != null)
		{
			item.eimo_setIDFavorite(!item.eimo_isIDFavorite());
			local id = item.getID();
			return ::World.Assets.getStash().getItems().filter(@(_, _i) _i != null && _i.getID() == id).map(@(_i) ::UIDataHelper.convertItemToUIData(_i, false));
		}
		return null;
	}

	function onFavoriteItemID( _instanceID )
	{
		if (!("Assets" in ::World)) return;
		local item = ::World.Assets.getStash().getItemByInstanceID(_instanceID).item;
		if (item != null)
		{
			item.eimo_setFavorite(!item.eimo_isFavorite())
			return [::UIDataHelper.convertItemToUIData(item, false)];
		}
		return null;
	}
})

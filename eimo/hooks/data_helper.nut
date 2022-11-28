::mods_hookNewObjectOnce("ui/global/data_helper", function ( o )
{
	local convertItemToUIData = o.convertItemToUIData;
	o.convertItemToUIData = function ( _item, _forceSmallIcon, _owner = null )
	{
		if (_item == null) return null;

		local result = convertItemToUIData(_item, _forceSmallIcon, _owner);
		
		if (_item.getCondition() < _item.getConditionMax())
		{
			result.eimo_repairProfit <- ::EIMO.getRepairProfit(_item);
		}

		if ("Flags" in ::World) result.eimo_forSale <- _item.eimo_isSetForSale();


		result.eimo_favorite <- _item.eimo_isFavorite()

		return result;
	}
});

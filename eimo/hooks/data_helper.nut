::mods_hookNewObjectOnce("ui/global/data_helper", function ( o )
{
	local convertItemToUIData = o.convertItemToUIData;
	o.convertItemToUIData = function ( _item, _forceSmallIcon, _owner = null )
	{
		if (_item == null) return null;

		local result = convertItemToUIData(_item, _forceSmallIcon, _owner);
		
		result.EIMO <- {};

		if (_item.getCondition() < _item.getConditionMax())
		{
			result.EIMO.repairProfit <- ::EIMO.getRepairProfit(_item);
		}

		if ("Flags" in this.World) result.EIMO.forSale <- _item.EIMO.isSetForSale();

		result.EIMO.favorite <- _item.EIMO.isFavorite()

		return result;
	}
});

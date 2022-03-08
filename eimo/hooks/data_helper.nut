::mods_hookNewObjectOnce("ui/global/data_helper", function ( o )
{
	local convertItemToUIData = o.convertItemToUIData;
	o.convertItemToUIData = function ( _item, _forceSmallIcon, _owner = null )
	{
		if (_item == null) return null;

		local result = convertItemToUIData(_item, _forceSmallIcon, _owner);
		
		result.showRepairRatio <-_item.getCondition() < _item.getConditionMax()
		result.repairRatio <- ::EIMO.getRepairProfit(_item);

		if ("Flags" in this.World) result.forSale <- _item.isSetForSale();

		result.favorite <- _item.isFavorite()

		return result;
	}
});

this.getroottable().Const.EIMO.hookDataHelper <- function()
{
	::mods_hookNewObjectOnce("ui/global/data_helper", function ( o )
	{
		local convertItemToUIData = o.convertItemToUIData;
		o.convertItemToUIData = function ( _item, _forceSmallIcon, _owner = null )
		{
			if (_item == null) return null;

			local result = convertItemToUIData(_item, _forceSmallIcon, _owner);
			
			result.showDratio <-_item.getCondition() < _item.getConditionMax() 
			result.dratio <- this.Const.EIMO.calcBalanceDiffFromRepair(_item);

			if ("Flags" in this.World) result.markc <- _item.isSetForSale();

			result.favorite <- _item.isFavorite()

			return result;
		}
	});
}
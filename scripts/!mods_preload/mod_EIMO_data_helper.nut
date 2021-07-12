this.getroottable().Const.EIMO.hookDataHelper <- function()
{
	::mods_hookNewObjectOnce("ui/global/data_helper", function ( o )
	{
		local convertItemToUIData = o.convertItemToUIData;
		o.convertItemToUIData = function ( _item, _forceSmallIcon, _owner = null )
		{
			if (_item == null)
			{
				return null;
			}

			local result = convertItemToUIData(_item, _forceSmallIcon, _owner);
			
			if (_item != null && _item.getItemType() < this.Const.Items.ItemType.Ammo && _item.getConditionMax() != _item.getCondition())
			{
				result.showDratio <- true;
			}
			else
			{
				result.showDratio <- false;
			}
			result.dratio <- this.Const.EIMO.calcBalanceDiffFromRepair(_item);

			if ("Flags" in this.World)
			{
				if (_item == null || !this.World.Flags.has(this.Const.EIMO.getItemSaleFlag(_item)) || this.World.Flags.get(this.Const.EIMO.getItemSaleFlag(_item)) == 0)
				{
					//this.logDebug("itemid false "+ itemid);
					result.markc <- false;
				}
				else
				{
					//this.logDebug("itemid true "+ itemid);
					result.markc <- true;
				}
			}

			if (_item.m.isFavorite)
			{
				result.favorite <- true;
			}
			else
			{
				result.favorite <- false;
			}

			return result;

		}
	});
}
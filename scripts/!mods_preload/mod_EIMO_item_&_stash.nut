this.getroottable().Const.EIMO.hookItemsStash <- function()
{
	::mods_hookBaseClass("items/item", function ( o )
	{
		while(!("setBought" in o)) o = o[o.SuperName];
		o.m.isFavorite <- false;
	});

	::mods_hookNewObject("items/stash_container", function (o)
	{
		local onItemCompare = o.onItemCompare;
		o.onItemCompare = function(_item1, _item2)
		{
			if (_item1 == null && _item2 == null) return 0;
			local ret = onItemCompare(_item1, _item2);
			if (ret == 0)
			{
				if (_item1.getCondition() > _item2.getCondition()) return -1;
				else if (_item1.getCondition() < _item2.getCondition()) return 1;
			}
			return ret;
		}
	});
}
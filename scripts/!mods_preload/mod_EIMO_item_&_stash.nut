this.getroottable().Const.EIMO.hookItemsStash <- function()
{
	::mods_hookBaseClass("items/item", function ( o )
	{
		while(!("setBought" in o)) o = o[o.SuperName];
		o.m.IsFavorite <- false;
		o.isFavorite <- @() this.m.IsFavorite
		o.setFavorite <- function (_bool)
		{
			this.m.IsFavorite = _bool
		}
	});

	::mods_hookNewObject("items/stash_container", function (o)
	{
		local onItemCompare = o.onItemCompare;
		o.onItemCompare = function(_item1, _item2)
		{
			if (_item1 == null && _item2 == null) return 0;
			if (_item1 != null && _item2 != null)
			{
				if (!_item1.isFavorite() && _item2.isFavorite()) return 1;
				if (_item1.isFavorite() && !_item2.isFavorite()) return -1;
			}
			local ret = onItemCompare(_item1, _item2);
			if (ret == 0)
			{
				if (_item1.getCondition() > _item2.getCondition()) return -1;
				if (_item1.getCondition() < _item2.getCondition()) return 1;
			}
			return ret;
		}
	});
}
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

		o.isSetForSale <- function ()
		{
			local sell = this.World.Flags.has(this.Const.EIMO.getItemSaleFlag(this)) && this.World.Flags.get(this.Const.EIMO.getItemSaleFlag(this)) == 1;
			if(this.Const.EIMO.isLayered(this) && sell)
			{
				foreach(layer in this.m.Upgrades)
				{
					if(layer != null && !layer.isSetForSale()) return false;
				}
			}
			return sell;
		}

		o.setForSale <- function (_bool)
		{
			if(this.Const.EIMO.isLayered(this))
			{
				foreach(layer in this.m.Upgrades)
				{
					if(layer != null) layer.setForSale(_bool);
				}
			}
			if(_bool) this.World.Flags.set(this.Const.EIMO.getItemSaleFlag(this), 1);
			else this.World.Flags.remove(this.Const.EIMO.getItemSaleFlag(this));
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
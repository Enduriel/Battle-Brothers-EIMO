this.getroottable().Const.EIMO.hookSettlement <- function()
{
	::mods_hookExactClass("entity/world/settlement", function (o)
	{
		o.getBuildings <- function ()
		{
			local ret = [];
			foreach (b in this.m.Buildings)
			{
				if (b != null)
				{
					ret.push(b);
				}
			}
			return ret;
		}
	});
}
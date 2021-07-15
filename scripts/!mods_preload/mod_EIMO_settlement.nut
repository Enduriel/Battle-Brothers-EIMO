this.getroottable().Const.EIMO.hookSettlement <- function()
{
	::mods_hookExactClass("entity/world/settlement", function (o)
	{
		o.getBuildings <- function ()
		{
			return this.m.Buildings;
		}
	});
}
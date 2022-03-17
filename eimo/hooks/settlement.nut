::mods_hookExactClass("entity/world/settlement", function (o)
{
	o.eimo_getBuildings <- function()
	{
		local ret = [];
		foreach (building in this.m.Buildings)
		{
			if (building != null)
			{
				ret.push(building);
			}
		}
		return ret;
	}
});

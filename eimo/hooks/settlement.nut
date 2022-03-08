::mods_hookExactClass("entity/world/settlement", function (o)
{
	// Unnecessary in Legends (it adds the same function)
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

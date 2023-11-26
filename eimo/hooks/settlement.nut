::EIMO.HookMod.hook("scripts/entity/world/settlement", function(q) {
	q.eimo_getBuildings <- function()
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
})

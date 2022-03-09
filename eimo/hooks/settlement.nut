::mods_hookExactClass("entity/world/settlement", function (o)
{
	o.EIMO <- {
		function getBuildings()
		{
			local ret = [];
			foreach (building in this.m.Buildings)
			{
				if (building != null)
				{
					ret.push(b);
				}
			}
			return ret;
		}
	}.setdelegate(o);
});

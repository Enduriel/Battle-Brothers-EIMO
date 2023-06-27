::Hooks.addNewFunctions(::EIMO.ID, "scripts/entity/world/settlement", {
	function eimo_getBuildings()
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

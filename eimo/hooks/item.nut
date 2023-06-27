::Hooks.addFields(::EIMO.ID, "scripts/items/item", {
	eimo_IsFavorite = false
});

::Hooks.addNewFunctions(::EIMO.ID, "scripts/items/item", {
	function eimo_isFavorite()
	{
		return this.m.eimo_IsFavorite;
	}

	function eimo_setFavorite( _bool )
	{
		this.m.eimo_IsFavorite = _bool;
	}

	function eimo_isSetForSale()
	{
		local sell = this.getID() in ::EIMO.ForSaleIDs;
		if (::EIMO.isLegendArmor(this) && sell)
		{
			foreach (upgrade in this.m.Upgrades)
			{
				if (upgrade != null && !upgrade.eimo_isSetForSale())
				{
					return false;
				}
			}
		}
		return sell;
	}

	function eimo_setForSale( _bool )
	{
		if (::EIMO.isLegendArmor(this))
		{
			foreach (upgrade in this.m.Upgrades)
			{
				if (upgrade != null)
				{
					upgrade.eimo_setForSale(_bool);
				}
			}
		}
		if (_bool)
		{
			::EIMO.ForSaleIDs[this.getID()] <- true;
		}
		else if (this.getID() in ::EIMO.ForSaleIDs)
		{
			delete ::EIMO.ForSaleIDs[this.getID()];
		}
	}

	function eimo_isIDFavorite()
	{
		local sell = this.getID() in ::EIMO.FavoriteIDs;
		if (::EIMO.isLegendArmor(this) && sell)
		{
			foreach (upgrade in this.m.Upgrades)
			{
				if (upgrade != null && !upgrade.eimo_isIDFavorite())
				{
					return false;
				}
			}
		}
		return sell;
	}

	function eimo_setIDFavorite( _bool )
	{
		if (::EIMO.isLegendArmor(this))
		{
			foreach (upgrade in this.m.Upgrades)
			{
				if (upgrade != null)
				{
					upgrade.eimo_setIDFavorite(_bool);
				}
			}
		}
		if (_bool)
		{
			::EIMO.FavoriteIDs[this.getID()] <- true;
		}
		else if (this.getID() in ::EIMO.FavoriteIDs)
		{
			delete ::EIMO.FavoriteIDs[this.getID()];
		}
	}

	function eimo_shouldBeSold()
	{
		return this.eimo_isSetForSale() && !this.eimo_isFavorite() && !this.eimo_isIDFavorite() && !(this.getCondition() < this.getConditionMax() && ::EIMO.getRepairRatio(this) > ::EIMO.Mod.ModSettings.getSetting(::EIMO.WaitThresholdID).getValue())
	}

	function eimo_getMaxValue()
	{
		if (::EIMO.isLegendArmor(this))
		{
			local ret = this.m.Value;
			foreach (upgrade in this.m.Upgrades)
			{
				if (upgrade != null)
				{
					ret += upgrade.m.Value;
				}
			}
			return ret;
		}
		return this.m.Value;
	}
});

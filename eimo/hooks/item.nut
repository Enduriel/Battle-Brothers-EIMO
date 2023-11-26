::EIMO.HookMod.hook("scripts/items/item", function(q) {
	q.m.eimo_IsFavorite <- false;

	q.eimo_isFavorite <- function()
	{
		return this.m.eimo_IsFavorite;
	}

	q.eimo_setFavorite <- function( _bool )
	{
		this.m.eimo_IsFavorite = _bool;
	}

	q.eimo_isSetForSale <- function()
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

	q.eimo_setForSale <- function( _bool )
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

	q.eimo_isIDFavorite <- function()
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

	q.eimo_setIDFavorite <- function( _bool )
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

	q.eimo_shouldBeSold <- function()
	{
		return this.eimo_isSetForSale() && !this.eimo_isFavorite() && !this.eimo_isIDFavorite() && !(this.getCondition() < this.getConditionMax() && ::EIMO.getRepairRatio(this) > ::EIMO.Mod.ModSettings.getSetting(::EIMO.WaitThresholdID).getValue())
	}

	q.eimo_getMaxValue <- function()
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
})

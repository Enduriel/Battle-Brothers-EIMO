::mods_hookBaseClass("items/item", function ( o )
{
	o = o[o.SuperName];

	o.m.eimo_IsFavorite <- false;

	o.eimo_isFavorite <- function()
	{
		return this.m.eimo_IsFavorite;
	}

	o.eimo_setFavorite <- function( _bool )
	{
		this.m.eimo_IsFavorite = _bool;
	}

	o.eimo_isSetForSale <- function()
	{
		if (!("Flags" in this.World)) return false;

		local sell = this.World.Flags.has(::EIMO.getItemSaleFlag(this));
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

	o.eimo_setForSale <- function( _bool )
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
			this.World.Flags.set(::EIMO.getItemSaleFlag(this), true);
		}
		else
		{
			this.World.Flags.remove(::EIMO.getItemSaleFlag(this));
		}
	}

	o.eimo_shouldBeSold <- function()
	{
		return this.eimo_isSetForSale() && !this.eimo_isFavorite() && !(this.getCondition() < this.getConditionMax() && ::EIMO.getRepairRatio(this) > ::EIMO.Mod.ModSettings.getSetting(::EIMO.WaitThresholdID).getValue())
	}

	o.eimo_getMaxValue <- function()
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

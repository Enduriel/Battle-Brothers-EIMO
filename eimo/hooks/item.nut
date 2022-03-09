::mods_hookBaseClass("items/item", function ( o )
{
	o = o[o.SuperName];

	o.m.EIMO <- {
		IsFavorite = false;
	}

	o.EIMO <- {
		function IsFavorite()
		{
			return this.m.EIMO.IsFavorite;
		}

		function setFavorite( _bool )
		{
			this.m.EIMO.IsFavorite = _bool;
		}

		function isSetForSale()
		{
			if (!("Flags" in this.World)) return false;

			local sell = this.World.Flags.has(::EIMO.getItemSaleFlag(this));
			if (::EIMO.isLegendArmor(this) && sell)
			{
				foreach (upgrade in this.m.Upgrades)
				{
					if (upgrade != null && !upgrade.isSetForSale())
					{
						return false;
					}
				}
			}
			return sell;
		}

		function setForSale( _bool )
		{
			if (::EIMO.isLegendArmor(this))
			{
				foreach (upgrade in this.m.Upgrades)
				{
					if (upgrade != null)
					{
						upgrade.setForSale(_bool);
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

		function shouldBeSold()
		{
			return this.isSetForSale() && !this.isFavorite() && !(this.getCondition() < this.getConditionMax() && ::EIMO.getRepairRatio(this) > getModSetting(::EIMO.ID, ::EIMO.WaitThresholdID))
		}
	}.setdelegate(o);
});

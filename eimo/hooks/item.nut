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

	// Marks for sale and type favorites are per item type. Different items can share an ID (e.g. all arrow quivers are
	// "ammo.arrows"), so the key adds the script's class name. Keys saved by older versions are bare IDs and still match.
	q.eimo_getTypeKey <- function()
	{
		return this.getID() + "/" + this.ClassName;
	}

	q.eimo_isTypeIn <- function( _table )
	{
		return this.eimo_getTypeKey() in _table || this.getID() in _table;
	}

	q.eimo_setTypeIn <- function( _table, _bool )
	{
		if (_bool)
		{
			_table[this.eimo_getTypeKey()] <- true;
			return;
		}
		if (this.eimo_getTypeKey() in _table)
			delete _table[this.eimo_getTypeKey()];
		if (this.getID() in _table)
			delete _table[this.getID()];
	}

	q.eimo_isSetForSale <- function()
	{
		local sell = this.eimo_isTypeIn(::EIMO.ForSaleIDs);
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
		this.eimo_setTypeIn(::EIMO.ForSaleIDs, _bool);
	}

	q.eimo_isIDFavorite <- function()
	{
		local sell = this.eimo_isTypeIn(::EIMO.FavoriteIDs);
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
		this.eimo_setTypeIn(::EIMO.FavoriteIDs, _bool);
	}

	q.eimo_shouldBeSold <- function()
	{
		return this.eimo_isSetForSale() && !this.eimo_isFavorite() && !this.eimo_isIDFavorite() && !this.eimo_isWaitingForRepair();
	}

	// Worth repairing before selling, and either marked for repair or will be marked by the repair button
	q.eimo_isWaitingForRepair <- function()
	{
		if (!::EIMO.isRepairable(this) || !::EIMO.isDamaged(this))
			return false;
		local ratio = ::EIMO.getRepairRatio(this);
		if (ratio <= ::EIMO.Mod.ModSettings.getSetting(::EIMO.WaitThresholdID).getValue())
			return false;
		return this.isToBeRepaired() || ratio > ::EIMO.Mod.ModSettings.getSetting(::EIMO.RepairThresholdID).getValue();
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

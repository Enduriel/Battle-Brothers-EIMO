::EIMO.HookMod.hook("scripts/ui/global/data_helper", function(q){
	q.convertItemToUIData = @(__original) function( _item, _forceSmallIcon, _owner = null ) {
		if (_item == null) return null;

		local result = _originalFunction(_item, _forceSmallIcon, _owner);

		if (_item.getCondition() < _item.getConditionMax())
		{
			result.eimo_repairProfit <- ::EIMO.getRepairProfit(_item);
		}

		result.eimo_forSale <- _item.eimo_isSetForSale();
		result.eimo_idFavorite <- _item.eimo_isIDFavorite();
		result.eimo_favorite <- _item.eimo_isFavorite()

		return result;
	}
})

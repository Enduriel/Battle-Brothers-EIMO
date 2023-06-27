::Hooks.wrapFunctions(::EIMO.ID, "scripts/items/stash_container", {
	function onItemCompare( _originalFunction )
	{
		return function( _item1, _item2 ) {
			if (_item1 == null && _item2 == null) return 0;
			if (_item1 != null && _item2 != null)
			{
				if (!_item1.eimo_isFavorite() && _item2.eimo_isFavorite()) return 1;
				if (_item1.eimo_isFavorite() && !_item2.eimo_isFavorite()) return -1;
			}
			local ret = _originalFunction(_item1, _item2);
			if (ret == 0)
			{
				return _item2.getCondition() <=> _item1.getCondition();
			}
			return ret;
		};
	}
});

EIMO.Generic.setForSaleImageVisible = function(_itemSlot, _isVisible)
{
	var imageLayer = _itemSlot.find('.for-sale-layer').filter(':first');
	if (_isVisible)
	{
		imageLayer.removeClass('display-none').addClass('display-block');
	}
	else
	{
		imageLayer.addClass('display-none').removeClass('display-block');
	}
}

EIMO.Generic.setFavoriteImageVisible = function(_itemSlot, _isVisible)
{
	var imageLayer = _itemSlot.find('.favorite-layer').filter(':first');
	if (imageLayer.find('>img').filter(':first').attr('src') != Path.GFX + EIMO.ICON_FAVORITE) return;
	if (_isVisible)
	{
		imageLayer.removeClass('display-none').addClass('display-block');
	}
	else
	{
		imageLayer.addClass('display-none').removeClass('display-block');
	}
};

EIMO.Generic.setFavoriteIDImageVisible = function(_itemSlot, _isVisible)
{
	var imageLayer = _itemSlot.find('>.favorite-layer').filter(':first');
	if (_isVisible)
	{
		imageLayer.find('>img').filter(':first').attr('src', Path.GFX + EIMO.ICON_FAVORITE_ID)
		imageLayer.removeClass('display-none').addClass('display-block');
	}
	else
	{
		imageLayer.find('>img').filter(':first').attr('src', Path.GFX + EIMO.ICON_FAVORITE)
		if (!(_itemSlot.data('eimo').favorite))
			imageLayer.addClass('display-none').removeClass('display-block');
	}
}

EIMO.Generic.setRepairProfitVisible = function(_itemSlot, _value, _color)
{
	if (_color === undefined) {_color = '#ffffff'}
	var layer = _itemSlot.find('.repair-profit-layer').filter(':first');
	var label = layer.find('.label').filter(':first');
	if (_value != 0) // intentionally falsy check
	{
		label.text(_value.toString());
		layer.removeClass('display-none').addClass('display-block');
	}
	else
	{
		layer.removeClass('display-block').addClass('display-none');
	}
	label.css({'color' : _color});
};

EIMO.Generic.isUpdateNecessary = function(_cache, _forSale, _favorite, _idFavorite, _repairProfit)
{
	var ret = _cache.forSale != _forSale || _cache.favorite != _favorite || _cache.idFavorite != _idFavorite || _cache.repairProfit != _repairProfit;
	if (ret) {
		_cache.forSale = _forSale;
		_cache.favorite = _favorite;
		_cache.idFavorite = _idFavorite;
		_cache.repairProfit = _repairProfit;
	}
	return ret;
}

EIMO.Generic.updateSlotItem = function(_slot, _item)
{
	var cache = _slot.data('eimo');
	var updateNecessary = EIMO.Generic.isUpdateNecessary(cache, _item.eimo_forSale, _item.eimo_favorite, _item.eimo_idFavorite, _item.eimo_repairProfit);
	_slot.data('eimo', cache);
	if (!updateNecessary) {
		return;
	}
	switch (MSU.getSettingValue(EIMO.ID, EIMO.VisibilityLevelID))
	{
		case "Reduced":
			EIMO.Generic.setForSaleImageVisible(_slot, _item.eimo_forSale);
			EIMO.Generic.setFavoriteIDImageVisible(_slot, _item.eimo_idFavorite);
			EIMO.Generic.setFavoriteImageVisible(_slot, _item.eimo_favorite);
			break;
		case "None":
			break;
		case "Normal": default:
			EIMO.Generic.setForSaleImageVisible(_slot, _item.eimo_forSale);
			EIMO.Generic.setFavoriteIDImageVisible(_slot, _item.eimo_idFavorite);
			EIMO.Generic.setFavoriteImageVisible(_slot, _item.eimo_favorite);
			EIMO.Generic.setRepairProfitVisible(_slot, _item.eimo_repairProfit, _item['amountColor'])
	}
}

EIMO.Generic.selectivelyUpdateItemList = function( _itemSlots, _itemsData )
{
	if (_itemsData == null)
		return;
	var itemSlots = _itemSlots.find('.ui-control.item');
	var j = 0;
	for (var i = 0; i < itemSlots.length && j < _itemsData.length; ++i)
	{
		var slot = $(itemSlots.get(i));
		var data = slot.data('item');
		var id = 'id' in data ? data.id : data.itemId;
		if (id == _itemsData[j].id)
		{
			EIMO.Generic.updateSlotItem(slot, _itemsData[j++]);
		}
	}
}

EIMO.Hooks.assignItemToSlot = [];
EIMO.Generic.assignItemToSlot = function( _ogFunc )
{
	EIMO.Hooks.assignItemToSlot.push(_ogFunc);
	// doing this so other people can directly modify the underlying functions under EIMO if needed
	var oldFuncNum = EIMO.Hooks.assignItemToSlot.length - 1;
	return function( _arg1, _arg2, _arg3, _arg4 ) {
		var slot, item;
		if (_arg4 == undefined)
		{
			slot = _arg2;
			item = _arg3;
		}
		else
		{
			slot = _arg3;
			item = _arg4;
		}
		EIMO.Hooks.assignItemToSlot[oldFuncNum].call(this, _arg1, _arg2, _arg3, _arg4);

		if (('id' in item) && ('imagePath' in item))
		{
			EIMO.Generic.updateSlotItem(slot, item);
		}
	}
}

EIMO.Hooks.removeItemFromSlot = [];
EIMO.Generic.removeItemFromSlot = function( _ogFunc )
{
	EIMO.Hooks.removeItemFromSlot.push(_ogFunc);
	var oldFuncNum = EIMO.Hooks.removeItemFromSlot.length - 1;

	return function(_slot) {
		var cache = _slot.data('eimo');
		if (EIMO.Generic.isUpdateNecessary(cache, false, false, false, 0)) {
			EIMO.Generic.setForSaleImageVisible(_slot, false);
			EIMO.Generic.setFavoriteIDImageVisible(_slot, false);
			EIMO.Generic.setFavoriteImageVisible(_slot, false);
			EIMO.Generic.setRepairProfitVisible(_slot, 0);
		}
		EIMO.Hooks.removeItemFromSlot[oldFuncNum].call(this, _slot);
		_slot.data('eimo', cache);
	}
}

EIMO.Generic.addItemSlotMouseDownEvents = function( _itemSlot, _itemContainer ) {
	_itemSlot.bindFirst('mousedown', function(_event) {
		var itemData = $(this).data('item');
		var id = 'id' in itemData ? itemData.id : itemData.itemId;
		if (itemData.isEmpty)
			return;
		if (MSU.Keybinds.isMousebindPressed(EIMO.ID, "SetForSale", _event))
		{
			_event.stopImmediatePropagation();
			Screens.EIMOConnection.setForSaleItemID(id, function(_itemsData) {
				EIMO.Generic.selectivelyUpdateItemList(_itemContainer, _itemsData);
			});
			return false;
		}
		if (MSU.Keybinds.isMousebindPressed(EIMO.ID, "SetFavorite", _event))
		{
			_event.stopImmediatePropagation();
			Screens.EIMOConnection.favoriteItem(id, function(_itemsData) {
				EIMO.Generic.selectivelyUpdateItemList(_itemContainer, _itemsData);
			});
			return false;
		}
		if (MSU.Keybinds.isMousebindPressed(EIMO.ID, "SetIDFavorite", _event))
		{
			_event.stopImmediatePropagation();
			Screens.EIMOConnection.favoriteItemID(id, function(_itemsData) {
				EIMO.Generic.selectivelyUpdateItemList(_itemContainer, _itemsData);
			});
			return false;
		}
	})
}

EIMO.Hooks.createItemSlot = [];
EIMO.Generic.createItemSlot = function( _ogFunc )
{
	EIMO.Hooks.createItemSlot.push(_ogFunc);
	var oldFuncNum = EIMO.Hooks.createItemSlot.length - 1;

	return function(_owner, _index, _parentDiv, _screenDiv) {
		var ret = EIMO.Hooks.createItemSlot[oldFuncNum].call(this, _owner, _index, _parentDiv, _screenDiv);
		EIMO.Generic.addItemSlotMouseDownEvents(ret, _parentDiv);
		ret.data('eimo', {forSale: false, favorite: false, idFavorite: false, repairProfit: 0 });
		return ret;
	}
}

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
		if (!(_itemSlot.data('item').eimo_favorite))
			imageLayer.addClass('display-none').removeClass('display-block');
	}
}

EIMO.Generic.setRepairProfitVisible = function(_itemSlot, _value, _color)
{
	if (_color === undefined) {_color = '#ffffff'}
	var layer = _itemSlot.find('.repair-profit-layer').filter(':first');
	var label = layer.find('.label').filter(':first');
	if (_value !== undefined && _value !== null)
	{
		label.text(_value);
		layer.removeClass('display-none').addClass('display-block');
	}
	else
	{
		layer.removeClass('display-block').addClass('display-none');
	}
	label.css({'color' : _color});
};

EIMO.Generic.updateSlotItem = function(_slot, _item)
{
	var itemData = _slot.data('item');
	itemData.eimo_forSale = _item.eimo_forSale;
	itemData.eimo_favorite = _item.eimo_favorite;
	itemData.eimo_idFavorite = _item.eimo_idFavorite;
	itemData.eimo_repairProfit = _item.eimo_repairProfit === undefined ? 0 : _item.eimo_repairProfit;
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
			if (itemData.eimo_repairProfit != 0)
				EIMO.Generic.setRepairProfitVisible(_slot, itemData.eimo_repairProfit.toString(), _item['amountColor']);
	}
	_slot.data('item', itemData);
}

EIMO.Generic.selectivelyUpdateItemList = function( _itemSlots, _itemsData )
{
	if (_itemsData == null)
		return;
	var j = 0;
	for (var i = 0; i < _itemSlots.length && j < _itemsData.length; ++i)
	{
		var data = _itemSlots[i].data('item');
		var id = 'id' in data ? data.id : data.itemId;
		if (id == _itemsData[j].id)
		{
			EIMO.Generic.updateSlotItem(_itemSlots[i], _itemsData[j++]);
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
		EIMO.Generic.setForSaleImageVisible(_slot, false);
		EIMO.Generic.setFavoriteIDImageVisible(_slot, false);
		EIMO.Generic.setFavoriteImageVisible(_slot, false);
		EIMO.Generic.setRepairProfitVisible(_slot, null);
		EIMO.Hooks.removeItemFromSlot[oldFuncNum].call(this, _slot);
	}
}

EIMO.Generic.addItemSlotsMousedownEvents = function( _itemSlots )
{
	for (var i = 0; i < _itemSlots.length; i++)
	{
		var item = _itemSlots[i];
		item.bindFirst('mousedown', function(_event) {
			var itemData = $(this).data('item');
			var id = 'id' in itemData ? itemData.id : itemData.itemId;
			if (itemData.isEmpty)
				return;
			if (MSU.Keybinds.isMousebindPressed(EIMO.ID, "SetForSale", _event))
			{
				_event.stopImmediatePropagation();
				Screens.EIMOConnection.setForSaleItemID(id, function(_itemsData) {
					EIMO.Generic.selectivelyUpdateItemList(_itemSlots, _itemsData);
				});
				return false;
			}
			if (MSU.Keybinds.isMousebindPressed(EIMO.ID, "SetFavorite", _event))
			{
				_event.stopImmediatePropagation();
				Screens.EIMOConnection.favoriteItem(id, function(_itemsData) {
					EIMO.Generic.selectivelyUpdateItemList(_itemSlots, _itemsData);
				});
				return false;
			}
			if (MSU.Keybinds.isMousebindPressed(EIMO.ID, "SetIDFavorite", _event))
			{
				_event.stopImmediatePropagation();
				Screens.EIMOConnection.favoriteItemID(id, function(_itemsData) {
					EIMO.Generic.selectivelyUpdateItemList(_itemSlots, _itemsData);
				});
				return false;
			}
		})
	}
}

EIMO.Hooks.createItemSlots = [];
EIMO.Generic.createItemSlots = function( _ogFunc )
{
	EIMO.Hooks.createItemSlots.push(_ogFunc);
	var oldFuncNum = EIMO.Hooks.createItemSlots.length - 1;

	return function(_owner, _size, _itemArray, _itemContainer) {
		EIMO.Hooks.createItemSlots[oldFuncNum].call(this, _owner, _size, _itemArray, _itemContainer);
		EIMO.Generic.addItemSlotsMousedownEvents(_itemArray);
	}
}

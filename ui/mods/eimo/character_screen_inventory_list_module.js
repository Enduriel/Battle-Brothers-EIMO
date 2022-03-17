var charRemoveItemFromSlot = CharacterScreenInventoryListModule.prototype.removeItemFromSlot;
CharacterScreenInventoryListModule.prototype.removeItemFromSlot = function(_slot)
{
	_slot.setForSaleImageVisible(false);
	_slot.setFavoriteImageVisible(false);
	_slot.setRepairProfitVisible(null);
	charRemoveItemFromSlot.call(this, _slot);
}

var csAssignItemToSlot = CharacterScreenInventoryListModule.prototype.assignItemToSlot;
CharacterScreenInventoryListModule.prototype.assignItemToSlot = function(_entityId, _owner, _slot, _item)
{
	csAssignItemToSlot.call(this, _entityId, _owner, _slot, _item);
	if ((CharacterScreenIdentifier.Item.Id in _item) && (CharacterScreenIdentifier.Item.ImagePath in _item))
	{
		var itemData = _slot.data('item');
		itemData.EIMO = {};
		itemData.EIMO.forSale = _item.EIMO.forSale;
		itemData.EIMO.favorite = _item.EIMO.favorite;
		itemData.EIMO.repairProfit = Math.round(_item.EIMO.repairProfit === undefined ? 0 : _item.EIMO.repairProfit);
		switch (getModSettingValue(EIMO.ID, EIMO.VisibilityLevelID))
		{
			case "Reduced":
				_slot.setForSaleImageVisible(_item.EIMO.forSale);
				_slot.setFavoriteImageVisible(_item.EIMO.favorite);
				break;
			case "Off":
				break;
			case "Normal": default:
				_slot.setForSaleImageVisible(_item.EIMO.forSale);
				_slot.setFavoriteImageVisible(_item.EIMO.favorite);
				if (itemData.EIMO.repairProfit != 0 && itemData.EIMO.repairProfit !== undefined)
				{
					_slot.setRepairProfitVisible(itemData.EIMO.repairProfit.toString(), _item[CharacterScreenIdentifier.Item.AmountColor]);
				}
		}
	}
};

var csCreateItemSlots = CharacterScreenInventoryListModule.prototype.createItemSlots;
CharacterScreenInventoryListModule.prototype.createItemSlots = function( _owner, _size, _itemArray, _itemContainer )
{
	var self = this;
	_itemContainer.createListItem = function(_withPriceLayer, _backgroundImage, _classes)
	{
		var result = $.fn.createListItem.call(this, _withPriceLayer, _backgroundImage, _classes);
		result.mousedown(function(_event)
		{
			if (MSU.Keybinds.isMousebindPressed(EIMO.ID, "setForSale", _event))
			{
				var data = $(this).data('item');
				_event.stopImmediatePropagation();

				self.mDataSource.EIMOsetForSaleInventoryItem(data.itemId, function (_notNull)
				{
					if (_notNull)
					{
						data.EIMO.forSale = !data.EIMO.forSale;
						result.setForSaleImageVisible(data.EIMO.forSale);
					}
				});
				return false;
			}
			if (MSU.Keybinds.isMousebindPressed(EIMO.ID, "setFavorite", _event))
			{
				var data = $(this).data('item');
				_event.stopImmediatePropagation();

				self.mDataSource.EIMOfavoriteInventoryItem(data.itemId, function (_notNull)
				{
					if (_notNull)
					{
						data.EIMO.favorite = !data.EIMO.favorite;
						result.setFavoriteImageVisible(data.EIMO.favorite);
					}
				});
				return false;
			}
			return;
		});
		return result;
	}
	csCreateItemSlots.call(this, _owner, _size, _itemArray, _itemContainer);
	delete _itemContainer.createListItem;
}

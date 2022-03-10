var createListItem = $.fn.createListItem;
$.fn.createListItem = function(_withPriceLayer, _backgroundImage, _classes)
{
	var result = createListItem.call(this, _withPriceLayer, _backgroundImage, _classes);

	// Repair profit layer
	var repairProfitLayer = $('<div class="repair-profit-layer display-none"/>');
	result.append(repairProfitLayer);
	var repairProfitImage = $('<img/>');
	repairProfitImage.attr('src', Path.GFX + Asset.ICON_ASSET_MONEY);
	repairProfitLayer.append(repairProfitImage);
	var repairProfitLabel = $('<div class="label text-font-very-small font-color-value font-shadow-outline"/>');
	repairProfitLayer.append(repairProfitLabel);

	// For sale layer
	var forSaleLayer = $('<div class="for-sale-layer display-none"/>');
	result.append(forSaleLayer);
	var forSaleImage = $('<img/>');
	forSaleImage.attr('src', Path.GFX + EIMO.ICON_MONEY);
	forSaleLayer.append(forSaleImage);

	// Favorite layer
	var favoriteLayer = $('<div class="favorite-layer display-none"/>');
	result.append(favoriteLayer);
	var favoriteImage = $('<img/>');
	favoriteImage.attr('src', Path.GFX + EIMO.ICON_FAVORITE);
	favoriteLayer.append(favoriteImage);

	return result
}

$.fn.setForSaleImageVisible = function(_isVisible)
{
	var imageLayer = this.find('.for-sale-layer:first');
	if (_isVisible)
	{
		imageLayer.removeClass('display-none').addClass('display-block');
	}
	else
	{
		imageLayer.addClass('display-none').removeClass('display-block');
	}
};

$.fn.setFavoriteImageVisible = function(_isVisible)
{
	var imageLayer = this.find('.favorite-layer:first');
	if (_isVisible)
	{
		imageLayer.removeClass('display-none').addClass('display-block');
	}
	else
	{
		imageLayer.addClass('display-none').removeClass('display-block');
	}
};

$.fn.setRepairProfitVisible = function(_value, _color = '#ffffff')
{
	var layer = this.find('.dratio-layer:first');
	var label = layer.find('.label:first');
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
		itemData.forSale = _item.forSale;
		itemData.favorite = _item.favorite;
		itemData.repairProfit = Math.floor(_item.repairProfit === undefined ? 0 : _item.repairProfit);
		switch (getModSettingValue(EIMO.ID, EIMO.VisibilityLevelID))
		{
			case "Reduced":
				_slot.setForSaleImageVisible(_item.forSale);
				_slot.setFavoriteImageVisible(_item.favorite);
				break;
			case "Off":
				break;
			case "Normal": default:
				_slot.setForSaleImageVisible(_item.forSale);
				_slot.setFavoriteImageVisible(_item.favorite);
				if (_item.repairProfit != 0)
				{
					_slot.setRepairProfitVisible(itemData.repairProfit.toString(), _item[CharacterScreenIdentifier.Item.AmountColor]);
				}
		}
	}
};

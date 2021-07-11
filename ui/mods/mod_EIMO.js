var EIMOGlobalVisibilityLevel;
{
	createItemSlots = CharacterScreenInventoryListModule.prototype.createItemSlots;
	CharacterScreenInventoryListModule.prototype.createItemSlots = function (_owner, _size, _itemArray, _itemContainer)
	{
		createItemSlots.call(this, _owner, _size, _itemArray, _itemContainer);
		if(EIMOGlobalVisibilityLevel == undefined || EIMOGlobalVisibilityLevel == null)
		{
			this.mDataSource.EIMOgetVisibilityLevel();
		}
	};

	var createListItem = $.fn.createListItem;
	$.fn.createListItem = function(_withPriceLayer, _backgroundImage, _classes)
	{
		var result = createListItem.call(this, _withPriceLayer, _backgroundImage, _classes);

		// dratio layer
		var dratioLayer = $('<div class="dratio-layer display-none"/>');
		result.append(dratioLayer);
		var dratioImage = $('<img/>');
		dratioImage.attr('src', Path.GFX + "ui/icons/asset_money.png");
		dratioLayer.append(dratioImage);
		var dratioLabel = $('<div class="label text-font-very-small font-color-value font-shadow-outline"/>');
		dratioLayer.append(dratioLabel);
		
		//markc layer
		var markcLayer = $('<div class="markc-layer display-none"/>');
		result.append(markcLayer);
		var markcImage = $('<img/>');
		markcImage.attr('src', Path.GFX + "ui/icons/EIMO_money_icon.png");
		markcLayer.append(markcImage);
		
		//favorite layer
		
		var favoriteLayer = $('<div class="favorite-layer display-none"/>');
		result.append(favoriteLayer);
		var favoriteImage = $('<img/>');
		favoriteImage.attr('src', Path.GFX + "ui/icons/EIMO_favorite_icon.png");
		favoriteLayer.append(favoriteImage);
		
		return result
	}
	
	$.fn.setMarkcImageVisible = function(_isVisible)
	{
		var imageLayer = this.find('.markc-layer:first');
		if (imageLayer.length > 0)
		{
			if(_isVisible)
			{
				imageLayer.removeClass('display-none');
				imageLayer.addClass('display-block');
			}
			else
			{
				imageLayer.addClass('display-none');
				imageLayer.removeClass('display-block');
			}
		}
	};

	$.fn.setFavoriteImageVisible = function(_isVisible)
	{
		var imageLayer = this.find('.favorite-layer:first');
		if (imageLayer.length > 0)
		{
			if(_isVisible)
			{
				imageLayer.removeClass('display-none');
				imageLayer.addClass('display-block');
			}
			else
			{
				imageLayer.addClass('display-none');
				imageLayer.removeClass('display-block');
			}
		}
	};
	
	$.fn.setDratioVisible = function(_value, _color)
	{
		_color = _color || '#ffffff';
		var layer = this.find('.dratio-layer:first');
		if (layer.length > 0)
		{
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
		}
	};

	var charRemoveItemFromSlot = CharacterScreenInventoryListModule.prototype.removeItemFromSlot;
	CharacterScreenInventoryListModule.prototype.removeItemFromSlot = function(_slot)
	{
		_slot.setMarkcImageVisible(false);
		_slot.setFavoriteImageVisible(false);
		_slot.setDratioVisible(null,"#ffffff");
		charRemoveItemFromSlot.call(this, _slot);
	}
	
	var csAssignItemToSlot = CharacterScreenInventoryListModule.prototype.assignItemToSlot;
	CharacterScreenInventoryListModule.prototype.assignItemToSlot = function(_entityId, _owner, _slot, _item)
	{
		csAssignItemToSlot.call(this, _entityId, _owner, _slot, _item);
		if((CharacterScreenIdentifier.Item.Id in _item) && (CharacterScreenIdentifier.Item.ImagePath in _item))
		{
			var itemData = _slot.data('item');
			itemData.markc = _item.markc;
			itemData.favorite = _item.favorite;
			var dratioa = Math.floor(_item.dratio);
			switch (EIMOGlobalVisibilityLevel)
			{
				case 1:
					_slot.setMarkcImageVisible(_item.markc);
					_slot.setFavoriteImageVisible(_item.favorite);
					break;
				case 2:
					break;
				case 0: default:
					_slot.setMarkcImageVisible(_item.markc);
					_slot.setFavoriteImageVisible(_item.favorite);
					if(_item.showDratio === true && _item[CharacterScreenIdentifier.Item.Amount] != '')
					{
						_slot.setDratioVisible('' + dratioa, _item[CharacterScreenIdentifier.Item.AmountColor]);
					}
			}
		}
	};
}
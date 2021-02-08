var EIMOGlobalVisibilityLevel;
{
	
	CharacterScreenDatasource.prototype.setVisibilityLevel = function ()
	{
		var self = this;
		var temp;
		this.notifyBackendgetVisibilityLevel(function(result){
			var temp = result
			self.finalSetVis(temp);
		});
		
	};

	CharacterScreenDatasource.prototype.finalSetVis = function (data)
	{
		EIMOGlobalVisibilityLevel = data;
		//this.mStashList = data.stash;
		this.notifyEventListener(CharacterScreenDatasourceIdentifier.Inventory.StashLoaded, this.mStashList);
	}


	createItemSlots = CharacterScreenInventoryListModule.prototype.createItemSlots;
	CharacterScreenInventoryListModule.prototype.createItemSlots = function (_owner, _size, _itemArray, _itemContainer)
	{
		createItemSlots.bind(this)(_owner, _size, _itemArray, _itemContainer);
		if(EIMOGlobalVisibilityLevel == undefined || EIMOGlobalVisibilityLevel == null)
		{
			this.mDataSource.setVisibilityLevel();
		}
	};

	CharacterScreenDatasource.prototype.notifyBackendgetVisibilityLevel = function (_callback)
	{
		SQ.call(this.mSQHandle, 'EIMOgetVisibilityLevel', null, _callback);
	}

	CharacterScreenDatasource.prototype.logSomething = function (data)
	{
		SQ.call(this.mSQHandle, 'logSomething', data)
	};

	WorldTownScreenShopDialogModule.prototype.getVisibilityLevel = function ()
	{
		var data = {
			'visLevel' : 0
		};
		SQ.call(this.mSQHandle, 'EIMOgetVisibilityLevel', data,_callback);
		return data['visLevel'];
	}



	var createListItem = $.fn.createListItem;
	$.fn.createListItem = function(_withPriceLayer, _backgroundImage, _classes)
	{
		var result = createListItem.bind(this)(_withPriceLayer, _backgroundImage, _classes);
		// repair layer
		var repairLayer = $('<div class="repair-layer display-none"/>');
		result.append(repairLayer);
		var repairImage = $('<img/>');
		repairImage.attr('src', Path.GFX + Asset.ICON_REPAIR_ITEM);
		repairLayer.append(repairImage);

		// dratio layer
		var dratioLayer = $('<div class="dratio-layer display-none"/>');
		result.append(dratioLayer);
		var dratioImage = $('<img/>');
		dratioImage.attr('src', Path.GFX + Asset.ICON_ASSET_SUPPLIES);
		dratioLayer.append(dratioImage);
		var dratioLabel = $('<div class="label text-font-very-small font-color-value font-shadow-outline"/>');
		dratioLayer.append(dratioLabel);
		
		//markc layer
		var markcLayer = $('<div class="markc-layer display-none"/>');
		result.append(markcLayer);
		var markcImage = $('<img/>');
		markcImage.attr('src', Path.GFX + Asset.ICON_MONEY_SMALL);
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
		charRemoveItemFromSlot.bind(this)(_slot);
	}
	
	
	CharacterScreenDatasource.prototype.repairAllButtonClicked = function(_itemId, _callback)
	{
	   this.notifyBackendRepairAllButtonClicked(_itemId, _callback);
	};

	CharacterScreenDatasource.prototype.EIMOchangeVisibilityButtonClicked = function(_itemId, _callback)
	{
		this.notifyBackendEIMOonChangeVisibilityButtonClicked(_itemId, _callback);
		this.setVisibilityLevel();
	};

	CharacterScreenDatasource.prototype.setForSaleInventoryItem = function(_itemId, _callback)
	{
	   this.notifyBackendSetForSaleInventoryItem(_itemId, _callback);
	};

	CharacterScreenDatasource.prototype.favoriteInventoryItem = function(_itemId, _callback)
	{
	   this.notifyBackendFavoriteInventoryItem(_itemId, _callback);
	};
	
	CharacterScreenDatasource.prototype.notifyBackendEIMOonChangeVisibilityButtonClicked = function (_sourceItemId, _callback)
	{
		SQ.call(this.mSQHandle, 'EIMOonChangeVisibilityButtonClicked', _sourceItemId, _callback);
	};

	CharacterScreenDatasource.prototype.notifyBackendRepairAllButtonClicked = function (_sourceItemId, _callback)
	{
		SQ.call(this.mSQHandle, 'onRepairAllButtonClicked', _sourceItemId, _callback);
	};

	CharacterScreenDatasource.prototype.notifyBackendSetForSaleInventoryItem = function (_sourceItemId, _callback)
	{
		SQ.call(this.mSQHandle, 'onSetForSaleInventoryItem', _sourceItemId, _callback);
	};

	CharacterScreenDatasource.prototype.notifyBackendFavoriteInventoryItem = function (_sourceItemId, _callback)
	{
		SQ.call(this.mSQHandle, 'onFavoriteInventoryItem', _sourceItemId, _callback);
	};
	
	
	var charassignItemToSlot = CharacterScreenInventoryListModule.prototype.assignItemToSlot;
	CharacterScreenInventoryListModule.prototype.assignItemToSlot = function(_entityId, _owner, _slot, _item)
	{
		charassignItemToSlot.bind(this)(_entityId, _owner, _slot, _item);
		if(!(CharacterScreenIdentifier.Item.Id in _item) || !(CharacterScreenIdentifier.Item.ImagePath in _item))
		{
		}
		else
		{
			var itemData = _slot.data('item');
			itemData.repair = _item.repair;
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
	
	var charBindTooltips = CharacterScreenInventoryListModule.prototype.bindTooltips;
	CharacterScreenInventoryListModule.prototype.bindTooltips = function ()
	{
		//charBindTooltips.bind(this); Doesn't work for some reason, temporariliy overwriting vanilla function fully
		this.mSortInventoryButton.bindTooltip({ contentType: 'ui-element', elementId: TooltipIdentifier.CharacterScreen.RightPanelHeaderModule.SortButton });
	    this.mFilterAllButton.bindTooltip({ contentType: 'ui-element', elementId: TooltipIdentifier.CharacterScreen.RightPanelHeaderModule.FilterAllButton });
	    this.mFilterWeaponsButton.bindTooltip({ contentType: 'ui-element', elementId: TooltipIdentifier.CharacterScreen.RightPanelHeaderModule.FilterWeaponsButton });
	    this.mFilterArmorButton.bindTooltip({ contentType: 'ui-element', elementId: TooltipIdentifier.CharacterScreen.RightPanelHeaderModule.FilterArmorButton });
	    this.mFilterMiscButton.bindTooltip({ contentType: 'ui-element', elementId: TooltipIdentifier.CharacterScreen.RightPanelHeaderModule.FilterMiscButton });
	    this.mFilterUsableButton.bindTooltip({ contentType: 'ui-element', elementId: TooltipIdentifier.CharacterScreen.RightPanelHeaderModule.FilterUsableButton });
	    this.mFilterMoodButton.bindTooltip({ contentType: 'ui-element', elementId: TooltipIdentifier.CharacterScreen.RightPanelHeaderModule.FilterMoodButton });


		this.mDrepairButton.bindTooltip({ contentType: 'ui-element', elementId:  'character-screen.right-panel-header-module.DrepairButton' });
		this.mChangeVisibilityButton.bindTooltip({ contentType: 'ui-element', elementId:  'character-screen.right-panel-header-module.ChangeVisibilityButton' });
	};

	var charUnbindTooltips = CharacterScreenInventoryListModule.prototype.unbindTooltips;
	CharacterScreenInventoryListModule.prototype.unbindTooltips = function ()
	{
		//charUnbindTooltips.bind(this); Doesn't work for some reason, temporariliy overwriting vanilla function fully
		this.mSortInventoryButton.unbindTooltip();
	    this.mFilterAllButton.unbindTooltip();
	    this.mFilterWeaponsButton.unbindTooltip();
	    this.mFilterArmorButton.unbindTooltip();
	    this.mFilterMiscButton.unbindTooltip();
	    this.mFilterUsableButton.unbindTooltip();
	    this.mFilterMoodButton.unbindTooltip();

		this.mDrepairButton.unbindTooltip();
		this.mChangeVisibilityButton.unbindTooltip();
	};


	WorldTownScreenShopDialogModule.prototype.setVisibilityLevel = function ()
	{
		var self = this;
		var temp;
		this.notifyBackendgetVisibilityLevel(function(result){
			temp = result;
			self.finalSetVis(temp);
		});
	};

	WorldTownScreenShopDialogModule.prototype.finalSetVis = function (level)
	{
		EIMOGlobalVisibilityLevel = level;
		this.loadStashData(this.mStashList);
	};

	WorldTownScreenShopDialogModule.prototype.logSomething = function (data)
	{
		SQ.call(this.mSQHandle, 'logSomething', data)
	};

	WorldTownScreenShopDialogModule.prototype.notifyBackendgetVisibilityLevel = function (_callback)
	{
		SQ.call(this.mSQHandle, 'EIMOgetVisibilityLevel', null, _callback);
	};

	var wtLoadFromData = WorldTownScreenShopDialogModule.prototype.loadFromData;
	WorldTownScreenShopDialogModule.prototype.loadFromData = function (_data)
	{
		wtLoadFromData.bind(this)(_data);
		if(EIMOGlobalVisibilityLevel == undefined || EIMOGlobalVisibilityLevel == null)
		{

			this.setVisibilityLevel();
		}
	};

	WorldTownScreenShopDialogModule.prototype.sellAllButtonClicked = function ()
	{
		var self = this;

		this.notifyBackendSellAllButtonClicked(function(data)
		{
	        // update assets
	        self.mParent.loadAssetData(data.Assets);

	        if ('StashSpaceUsed' in data)
	        {
	            self.mStashSpaceUsed = data.StashSpaceUsed;
	        }

	        if ('StashSpaceMax' in data)
	        {
	            self.mStashSpaceMax = data.StashSpaceMax;
	        }

	        if ('Stash' in data)
	        {
	            self.updateStashList(data.Stash);
	        }

	        if ('Shop' in data)
	        {
	            self.updateShopList(data.Shop);
	        }
		});
	}

	WorldTownScreenShopDialogModule.prototype.notifyBackendSellAllButtonClicked = function (_callback) 
	{
		SQ.call(this.mSQHandle, 'onSellAllButtonClicked', null, _callback);
	};
	
	var wtremoveItemFromSlot = WorldTownScreenShopDialogModule.prototype.removeItemFromSlot;
	WorldTownScreenShopDialogModule.prototype.removeItemFromSlot = function(_slot)
	{
		_slot.setMarkcImageVisible(false);
		_slot.setFavoriteImageVisible(false);
		_slot.setDratioVisible(null,"#ffffff");
		wtremoveItemFromSlot.bind(this)(_slot);
	};
	
	var assignItemToSlot = WorldTownScreenShopDialogModule.prototype.assignItemToSlot;
	WorldTownScreenShopDialogModule.prototype.assignItemToSlot = function(_owner, _slot, _item)
	{
		assignItemToSlot.bind(this)(_owner, _slot, _item);
		if(!('id' in _item) || !('imagePath' in _item))
		{
		}
		else
		{
			var itemData = _slot.data('item');
			itemData.repair = _item.repair;
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
	
	var wtBindTooltips = WorldTownScreenShopDialogModule.prototype.bindTooltips;
	WorldTownScreenShopDialogModule.prototype.bindTooltips = function ()
	{
		//wtBindTooltips.bind(this); Doesn't work for some reason, temporariliy overwriting vanilla function fully
		this.mAssets.bindTooltips();
	    this.mStashSlotSizeContainer.bindTooltip({ contentType: 'ui-element', elementId: TooltipIdentifier.Stash.FreeSlots });
	    this.mLeaveButton.bindTooltip({ contentType: 'ui-element', elementId: TooltipIdentifier.WorldTownScreen.ShopDialogModule.LeaveButton });

		this.mSortInventoryButton.bindTooltip({ contentType: 'ui-element', elementId: TooltipIdentifier.CharacterScreen.RightPanelHeaderModule.SortButton });
		this.mFilterAllButton.bindTooltip({ contentType: 'ui-element', elementId: TooltipIdentifier.CharacterScreen.RightPanelHeaderModule.FilterAllButton });
		this.mFilterWeaponsButton.bindTooltip({ contentType: 'ui-element', elementId: TooltipIdentifier.CharacterScreen.RightPanelHeaderModule.FilterWeaponsButton });
		this.mFilterArmorButton.bindTooltip({ contentType: 'ui-element', elementId: TooltipIdentifier.CharacterScreen.RightPanelHeaderModule.FilterArmorButton });
	    this.mFilterMiscButton.bindTooltip({ contentType: 'ui-element', elementId: TooltipIdentifier.CharacterScreen.RightPanelHeaderModule.FilterMiscButton });
	    this.mFilterUsableButton.bindTooltip({ contentType: 'ui-element', elementId: TooltipIdentifier.CharacterScreen.RightPanelHeaderModule.FilterUsableButton });


		this.mSellAllButton.bindTooltip({ contentType: 'ui-element', elementId:  'character-screen.right-panel-header-module.SellAllButton' });
	};

	var wtUnbindTooltips = WorldTownScreenShopDialogModule.prototype.unbindTooltips;
	WorldTownScreenShopDialogModule.prototype.unbindTooltips = function ()
	{
		//wtUnbindTooltips.bind(this); Doesn't work for some reason, temporariliy overwriting vanilla function fully
		this.mAssets.unbindTooltips();
		this.mStashSlotSizeContainer.unbindTooltip();
	    this.mLeaveButton.unbindTooltip();

		this.mSortInventoryButton.unbindTooltip();
		this.mFilterAllButton.unbindTooltip();
		this.mFilterWeaponsButton.unbindTooltip();
		this.mFilterArmorButton.unbindTooltip();
	    this.mFilterMiscButton.unbindTooltip();
	    this.mFilterUsableButton.unbindTooltip();


		this.mSellAllButton.unbindTooltip();
	};
	
}
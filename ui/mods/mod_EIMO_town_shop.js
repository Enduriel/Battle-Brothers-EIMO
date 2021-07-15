{
	WorldTownScreenShopDialogModule.prototype.EIMOgetVisibilityLevel = function ()
	{
		var self = this;
		var temp;
		this.notifyBackendgetVisibilityLevel(function(result){
			temp = result;
			self.EIMOafterGetVisibility(temp);
		});
	};

	WorldTownScreenShopDialogModule.prototype.EIMOafterGetVisibility = function (level)
	{
		EIMOGlobalVisibilityLevel = level;
		this.loadStashData(this.mStashList);
	};

	WorldTownScreenShopDialogModule.prototype.notifyBackendgetVisibilityLevel = function (_callback)
	{
		SQ.call(this.mSQHandle, 'EIMOgetVisibilityLevel', null, _callback);
	};

	var wtLoadFromData = WorldTownScreenShopDialogModule.prototype.loadFromData;
	WorldTownScreenShopDialogModule.prototype.loadFromData = function (_data)
	{
		wtLoadFromData.call(this, _data);
		if(EIMOGlobalVisibilityLevel == undefined || EIMOGlobalVisibilityLevel == null)
		{
			this.EIMOgetVisibilityLevel();
		}
	};

	WorldTownScreenShopDialogModule.prototype.EIMOsellAllButtonClicked = function ()
	{
		var self = this;
		this.notifyBackendSellAllButtonClicked(function(data)
		{
			self.mParent.loadAssetData(data.Assets);

			if ('StashSpaceUsed' in data) self.mStashSpaceUsed = data.StashSpaceUsed;
			if ('StashSpaceMax' in data) self.mStashSpaceMax = data.StashSpaceMax;
			if ('Stash' in data) self.updateStashList(data.Stash);
			if ('Shop' in data) self.updateShopList(data.Shop);
		});
	}

	WorldTownScreenShopDialogModule.prototype.notifyBackendSellAllButtonClicked = function (_callback) 
	{
		SQ.call(this.mSQHandle, 'onSellAllButtonClicked', null, _callback);
	};
	
	var wtRemoveItemFromSlot = WorldTownScreenShopDialogModule.prototype.removeItemFromSlot;
	WorldTownScreenShopDialogModule.prototype.removeItemFromSlot = function(_slot)
	{
		_slot.setMarkcImageVisible(false);
		_slot.setFavoriteImageVisible(false);
		_slot.setDratioVisible(null,"#ffffff");
		wtRemoveItemFromSlot.call(this, _slot);
	};
	
	var wtAssignItemToSlot = WorldTownScreenShopDialogModule.prototype.assignItemToSlot;
	WorldTownScreenShopDialogModule.prototype.assignItemToSlot = function(_owner, _slot, _item)
	{
		wtAssignItemToSlot.call(this, _owner, _slot, _item);
		if(!('id' in _item) || !('imagePath' in _item))
		{
		}
		else
		{
			var itemData = _slot.data('item');
			itemData.markc = _item.markc;
			itemData.favorite = _item.favorite;
			var dratioa = Math.floor(_item.dratio);
			switch (EIMOGlobalVisibilityLevel)
			{
				case 1:
					if(_owner === WorldTownScreenShop.ItemOwner.Stash)
					{
						_slot.setMarkcImageVisible(_item.markc);
						_slot.setFavoriteImageVisible(_item.favorite);
					}
					break;
				case 2:
					break;
				case 0: default:
					if(_owner === WorldTownScreenShop.ItemOwner.Stash)
					{
						_slot.setMarkcImageVisible(_item.markc);
						_slot.setFavoriteImageVisible(_item.favorite);
						if(_item.showDratio === true && _item[CharacterScreenIdentifier.Item.Amount] != '')
						{
							_slot.setDratioVisible('' + dratioa, _item[CharacterScreenIdentifier.Item.AmountColor]);
						}
					}
			}
		}
	};

	var wtCreateDIV = WorldTownScreenShopDialogModule.prototype.createDIV;
	WorldTownScreenShopDialogModule.prototype.createDIV = function (_parentDiv)
	{
		wtCreateDIV.call(this, _parentDiv);
		var self = this
		var container = this.mDialogContainer.findDialogContentContainer();
		buttonContainer = container.children(".column.is-middle").children(".row.is-content").children(".button-container");

		var layout = $('<div class="l-button is-sellall"/>');
		buttonContainer.append(layout);
		this.mSellAllButton = layout.createImageButton(Path.GFX + Asset.ICON_ASSET_MONEY, function()
		{
			self.EIMOsellAllButtonClicked();
		}, '', 3);
	};
	
	var wtDestroyDIV = WorldTownScreenShopDialogModule.prototype.destroyDIV;
	WorldTownScreenShopDialogModule.prototype.destroyDIV = function (_parentDiv)
	{
		wtDestroyDIV.call(this, _parentDiv);

		this.mSellAllButton.remove()
		this.mSellAllButton = null;
	};

	var wtBindTooltips = WorldTownScreenShopDialogModule.prototype.bindTooltips;
	WorldTownScreenShopDialogModule.prototype.bindTooltips = function ()
	{
		wtBindTooltips.call(this);
		this.mSellAllButton.bindTooltip({ contentType: 'ui-element', elementId:  'EIMO.SellAllButton' });
	};

	var wtUnbindTooltips = WorldTownScreenShopDialogModule.prototype.unbindTooltips;
	WorldTownScreenShopDialogModule.prototype.unbindTooltips = function ()
	{
		wtUnbindTooltips.call(this);
		this.mSellAllButton.unbindTooltip();
	};
}
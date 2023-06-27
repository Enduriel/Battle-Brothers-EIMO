WorldTownScreenShopDialogModule.prototype.EIMOsellAllButtonClicked = function ()
{
	var self = this;
	this.EIMOnotifyBackendSellAllButtonClicked(function(data)
	{
		self.mParent.loadAssetData(data.Assets);

		if ('StashSpaceUsed' in data) self.mStashSpaceUsed = data.StashSpaceUsed;
		if ('StashSpaceMax' in data) self.mStashSpaceMax = data.StashSpaceMax;
		if ('Stash' in data) self.updateStashList(data.Stash);
		if ('Shop' in data) self.updateShopList(data.Shop);
	});
}

WorldTownScreenShopDialogModule.prototype.EIMOnotifyBackendSellAllButtonClicked = function (_callback)
{
	SQ.call(this.mSQHandle, 'eimo_onSellAllButtonClicked', null, _callback);
};

EIMO.Hooks.WorldTownScreenShopDialogModule_removeItemFromSlot = WorldTownScreenShopDialogModule.prototype.removeItemFromSlot;
WorldTownScreenShopDialogModule.prototype.removeItemFromSlot = function(_slot)
{
	_slot.setForSaleImageVisible(false);
	_slot.setFavoriteIDImageVisible(false);
	_slot.setFavoriteImageVisible(false);
	_slot.setRepairProfitVisible(null);
	EIMO.Hooks.WorldTownScreenShopDialogModule_removeItemFromSlot.call(this, _slot);
};

EIMO.Hooks.WorldTownScreenShopDialogModule_assignItemToSlot = WorldTownScreenShopDialogModule.prototype.assignItemToSlot;
WorldTownScreenShopDialogModule.prototype.assignItemToSlot = function(_owner, _slot, _item)
{
	EIMO.Hooks.WorldTownScreenShopDialogModule_assignItemToSlot.call(this, _owner, _slot, _item);
	if ((WorldTownScreenIdentifier.Item.Id in _item) && (WorldTownScreenIdentifier.Item.ImagePath in _item))
	{
		var itemData = _slot.data('item');
		itemData.eimo_forSale = _item.eimo_forSale;
		itemData.eimo_favorite = _item.eimo_favorite;
		itemData.eimo_idFavorite = _item.eimo_idFavorite;
		itemData.eimo_repairProfit = Math.round(_item.eimo_repairProfit === undefined ? 0 : _item.eimo_repairProfit);
		switch (MSU.getSettingValue(EIMO.ID, EIMO.VisibilityLevelID))
		{
			case "Reduced":
				_slot.setForSaleImageVisible(_item.eimo_forSale);
				_slot.setFavoriteIDImageVisible(_item.eimo_idFavorite);
				_slot.setFavoriteImageVisible(_item.eimo_favorite);
				break;
			case "None":
				break;
			case "Normal": default:
				_slot.setForSaleImageVisible(_item.eimo_forSale);
				_slot.setFavoriteIDImageVisible(_item.eimo_idFavorite);
				_slot.setFavoriteImageVisible(_item.eimo_favorite);
				if (itemData.eimo_repairProfit != 0 && itemData.eimo_repairProfit !== undefined)
				{
					_slot.setRepairProfitVisible(itemData.eimo_repairProfit.toString(), _item[CharacterScreenIdentifier.Item.AmountColor]);
				}
		}
	}
};

EIMO.Hooks.WorldTownScreenShopDialogModule_createDIV = WorldTownScreenShopDialogModule.prototype.createDIV;
WorldTownScreenShopDialogModule.prototype.createDIV = function (_parentDiv)
{
	EIMO.Hooks.WorldTownScreenShopDialogModule_createDIV.call(this, _parentDiv);
	var self = this
	var container = this.mDialogContainer.findDialogContentContainer();
	buttonContainer = container.children(".column.is-middle").children(".row.is-content").children(".button-container");

	var layout = $('<div class="l-button sell-all-button"/>');
	buttonContainer.append(layout);
	this.mSellAllButton = layout.createImageButton(Path.GFX + Asset.ICON_ASSET_MONEY, function()
	{
		self.EIMOsellAllButtonClicked();
	}, '', 3);
};

EIMO.Hooks.WorldTownScreenShopDialogModule_destroyDIV = WorldTownScreenShopDialogModule.prototype.destroyDIV;
WorldTownScreenShopDialogModule.prototype.destroyDIV = function (_parentDiv)
{
	EIMO.Hooks.WorldTownScreenShopDialogModule_destroyDIV.call(this, _parentDiv);

	this.mSellAllButton.remove()
	this.mSellAllButton = null;
};

EIMO.Hooks.WorldTownScreenShopDialogModule_bindTooltips = WorldTownScreenShopDialogModule.prototype.bindTooltips;
WorldTownScreenShopDialogModule.prototype.bindTooltips = function ()
{
	EIMO.Hooks.WorldTownScreenShopDialogModule_bindTooltips.call(this);
	this.mSellAllButton.bindTooltip({ contentType: 'msu-generic', modId: EIMO.ID, elementId:  'TownShopDialogModule.SellAllButton' });
};

EIMO.Hooks.WorldTownScreenShopDialogModule_unbindTooltips = WorldTownScreenShopDialogModule.prototype.unbindTooltips;
WorldTownScreenShopDialogModule.prototype.unbindTooltips = function ()
{
	EIMO.Hooks.WorldTownScreenShopDialogModule_unbindTooltips.call(this);
	this.mSellAllButton.unbindTooltip();
};

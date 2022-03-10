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
	SQ.call(this.mSQHandle, 'EIMO.onSellAllButtonClicked', null, _callback);
};

var wtRemoveItemFromSlot = WorldTownScreenShopDialogModule.prototype.removeItemFromSlot;
WorldTownScreenShopDialogModule.prototype.removeItemFromSlot = function(_slot)
{
	_slot.setForSaleImageVisible(false);
	_slot.setFavoriteImageVisible(false);
	_slot.setRepairProfitVisible(null,"#ffffff");
	wtRemoveItemFromSlot.call(this, _slot);
};

var wtAssignItemToSlot = WorldTownScreenShopDialogModule.prototype.assignItemToSlot;
WorldTownScreenShopDialogModule.prototype.assignItemToSlot = function(_owner, _slot, _item)
{
	wtAssignItemToSlot.call(this, _owner, _slot, _item);
	if ((WorldTownScreenIdentifier.Item.Id in _item) && (WorldTownScreenIdentifier.Item.ImagePath in _item))
	{
		var itemData = _slot.data('item');
		itemData.forSale = _item.forSale;
		itemData.favorite = _item.favorite;
		itemData.repairProfit = Math.floor(_item.repairProfit === undefined ? 0 : _item.repairProfit);
		switch (getModSettingValue("mod_EIMO", "visibilityLevel"))
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

var wtCreateDIV = WorldTownScreenShopDialogModule.prototype.createDIV;
WorldTownScreenShopDialogModule.prototype.createDIV = function (_parentDiv)
{
	wtCreateDIV.call(this, _parentDiv);
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

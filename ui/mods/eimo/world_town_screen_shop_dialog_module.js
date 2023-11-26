WorldTownScreenShopDialogModule.prototype.removeItemFromSlot = EIMO.Generic.removeItemFromSlot(WorldTownScreenShopDialogModule.prototype.removeItemFromSlot);
WorldTownScreenShopDialogModule.prototype.assignItemToSlot = EIMO.Generic.assignItemToSlot(WorldTownScreenShopDialogModule.prototype.assignItemToSlot);

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

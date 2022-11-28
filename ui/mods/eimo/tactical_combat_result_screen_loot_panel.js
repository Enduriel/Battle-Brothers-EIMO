tcCreateDiv = TacticalCombatResultScreenLootPanel.prototype.createDIV;
TacticalCombatResultScreenLootPanel.prototype.createDIV = function (_parentDiv)
{
	tcCreateDiv.call(this, _parentDiv);

	var self = this;
	var middleColumn = this.mContainer.children(".column.is-middle").children(".row.is-content");

	var buttonLayout = $('<div class="smart-loot-layout"/>');
	middleColumn.append(buttonLayout);
	this.mSmartLootButton = buttonLayout.createCustomButton("", function ()
	{
		self.mDataSource.EIMOnotifyBackendSmartLootButtonPressed();
	}, 'smart-loot-button', 7);
};

var tcDestroyDIV = TacticalCombatResultScreenLootPanel.prototype.destroyDIV;
TacticalCombatResultScreenLootPanel.prototype.destroyDIV = function ()
{
	tcDestroyDIV.call(this);

	this.mSmartLootButton.remove();
	this.mSmartLootButton = null;
};

tcBindTooltips = TacticalCombatResultScreenLootPanel.prototype.bindTooltips;
TacticalCombatResultScreenLootPanel.prototype.bindTooltips = function()
{
	tcBindTooltips.call(this);

	this.mSmartLootButton.bindTooltip({ contentType: 'msu-generic', modId: EIMO.ID, elementId: "TacticalCombatResultScreen.SmartLootButton" });
}

tcUnbindTooltips = TacticalCombatResultScreenLootPanel.prototype.unbindTooltips;
TacticalCombatResultScreenLootPanel.prototype.unbindTooltips = function()
{
	tcUnbindTooltips.call(this);

	this.mSmartLootButton.unbindTooltip();
}


var tcRemoveItemFromSlot = TacticalCombatResultScreenLootPanel.prototype.removeItemFromSlot;
TacticalCombatResultScreenLootPanel.prototype.removeItemFromSlot = function(_slot)
{
	_slot.setForSaleImageVisible(false);
	_slot.setFavoriteImageVisible(false);
	_slot.setFavoriteIDImageVisible(false);
	_slot.setRepairProfitVisible(null);
	tcRemoveItemFromSlot.call(this, _slot);
};

var tcAssignItemToSlot = TacticalCombatResultScreenLootPanel.prototype.assignItemToSlot;
TacticalCombatResultScreenLootPanel.prototype.assignItemToSlot = function(_owner, _slot, _item)
{
	tcAssignItemToSlot.call(this, _owner, _slot, _item);
	if ((TacticalCombatResultScreenIdentifier.Item.Id in _item) && (TacticalCombatResultScreenIdentifier.Item.ImagePath in _item))
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
			case "Off":
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

TacticalCombatResultScreenDatasource.prototype.EIMOnotifyBackendSmartLootButtonPressed = function ()
{
	var self = this;
	SQ.call(this.mSQHandle, 'eimo_onSmartLootButtonPressed', null, function(_data){
		self.loadFromData(_data);
	});
};

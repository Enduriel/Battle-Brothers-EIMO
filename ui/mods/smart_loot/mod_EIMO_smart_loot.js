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

	this.mSmartLootButton.bindTooltip({ contentType: 'ui-element', elementId: "EIMO.SmartLootButton" });
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
	_slot.setRepairProfitVisible(null,"#ffffff");
	tcRemoveItemFromSlot.call(this, _slot);
};

var tcAssignItemToSlot = TacticalCombatResultScreenLootPanel.prototype.assignItemToSlot;
WorldTownScreenShopDialogModule.prototype.assignItemToSlot = function(_owner, _slot, _item)
{
	wtAssignItemToSlot.call(this, _owner, _slot, _item);
	if ((TacticalCombatResultScreenIdentifier.Item.Id in _item) && (TacticalCombatResultScreenIdentifier.Item.ImagePath in _item))
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

TacticalCombatResultScreenDatasource.prototype.EIMOnotifyBackendSmartLootButtonPressed = function ()
{
	var self = this;
	SQ.call(this.mSQHandle, 'EIMO.onSmartLootButtonPressed', null, function(_data){
		self.loadFromData(_data);
	});
};

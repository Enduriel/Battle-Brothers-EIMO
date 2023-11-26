TacticalCombatResultScreenLootPanel.prototype.removeItemFromSlot = EIMO.Generic.removeItemFromSlot(TacticalCombatResultScreenLootPanel.prototype.removeItemFromSlot);
TacticalCombatResultScreenLootPanel.prototype.assignItemToSlot = EIMO.Generic.assignItemToSlot(TacticalCombatResultScreenLootPanel.prototype.assignItemToSlot);
TacticalCombatResultScreenLootPanel.prototype.createItemSlots = EIMO.Generic.createItemSlots(TacticalCombatResultScreenLootPanel.prototype.createItemSlots);

EIMO.Hooks.TacticalCombatResultScreenLootPanel_createDIV = TacticalCombatResultScreenLootPanel.prototype.createDIV;
TacticalCombatResultScreenLootPanel.prototype.createDIV = function (_parentDiv)
{
	EIMO.Hooks.TacticalCombatResultScreenLootPanel_createDIV.call(this, _parentDiv);

	var self = this;
	var middleColumn = this.mContainer.children(".column.is-middle").children(".row.is-content");

	var buttonLayout = $('<div class="smart-loot-layout"/>');
	middleColumn.append(buttonLayout);
	this.mSmartLootButton = buttonLayout.createCustomButton("", function ()
	{
		self.mDataSource.EIMOnotifyBackendSmartLootButtonPressed();
	}, 'smart-loot-button', 7);
};

EIMO.Hooks.TacticalCombatResultScreenLootPanel_destroyDIV = TacticalCombatResultScreenLootPanel.prototype.destroyDIV;
TacticalCombatResultScreenLootPanel.prototype.destroyDIV = function ()
{
	EIMO.Hooks.TacticalCombatResultScreenLootPanel_destroyDIV.call(this);

	this.mSmartLootButton.remove();
	this.mSmartLootButton = null;
};

EIMO.Hooks.TacticalCombatResultScreenLootPanel_bindTooltips = TacticalCombatResultScreenLootPanel.prototype.bindTooltips;
TacticalCombatResultScreenLootPanel.prototype.bindTooltips = function()
{
	EIMO.Hooks.TacticalCombatResultScreenLootPanel_bindTooltips.call(this);

	this.mSmartLootButton.bindTooltip({ contentType: 'msu-generic', modId: EIMO.ID, elementId: "TacticalCombatResultScreen.SmartLootButton" });
}

EIMO.Hooks.TacticalCombatResultScreenLootPanel_unbindTooltips = TacticalCombatResultScreenLootPanel.prototype.unbindTooltips;
TacticalCombatResultScreenLootPanel.prototype.unbindTooltips = function()
{
	EIMO.Hooks.TacticalCombatResultScreenLootPanel_unbindTooltips.call(this);

	this.mSmartLootButton.unbindTooltip();
}

TacticalCombatResultScreenDatasource.prototype.EIMOnotifyBackendSmartLootButtonPressed = function ()
{
	var self = this;
	SQ.call(this.mSQHandle, 'eimo_onSmartLootButtonPressed', null, function(_data){
		self.loadFromData(_data);
	});
};

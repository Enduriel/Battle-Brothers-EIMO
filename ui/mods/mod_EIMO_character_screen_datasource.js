CharacterScreenDatasource.prototype.EIMOnotifyBackendGetSettings = function (_callback)
{
	SQ.call(this.mSQHandle, 'EIMO.getSettings', null, _callback);
}

CharacterScreenDatasource.prototype.EIMOrepairAllButtonClicked = function(_itemId, _callback)
{
	this.EIMOnotifyBackendRepairAllButtonClicked(_itemId, _callback);
};

CharacterScreenDatasource.prototype.EIMOnotifyBackendRepairAllButtonClicked = function (_sourceItemId, _callback)
{
	SQ.call(this.mSQHandle, 'EIMO.onRepairAllButtonClicked', _sourceItemId, _callback);
};

CharacterScreenDatasource.prototype.EIMOsetForSaleInventoryItem = function(_itemId, _callback)
{
	this.EIMOnotifyBackendSetForSaleInventoryItem(_itemId, _callback);
};

CharacterScreenDatasource.prototype.EIMOnotifyBackendSetForSaleInventoryItem = function (_sourceItemId, _callback)
{
	SQ.call(this.mSQHandle, 'EIMO.onSetForSaleInventoryItem', _sourceItemId, _callback);
};

CharacterScreenDatasource.prototype.EIMOfavoriteInventoryItem = function(_itemId, _callback)
{
	this.EIMOnotifyBackendFavoriteInventoryItem(_itemId, _callback);
};

CharacterScreenDatasource.prototype.EIMOnotifyBackendFavoriteInventoryItem = function (_sourceItemId, _callback)
{
	SQ.call(this.mSQHandle, 'EIMO.onFavoriteInventoryItem', _sourceItemId, _callback);
};

CharacterScreenDatasource.prototype.EIMOpaidRepairBrother = function()
{
	this.EIMOnotifyBackendPaidRepairBrother();
};

CharacterScreenDatasource.prototype.EIMOnotifyBackendPaidRepairBrother = function ()
{
	SQ.call(this.mSQHandle, 'EIMO.jsPaidRepairBrother');
};

CharacterScreenDatasource.prototype.EIMOpaidRepairCompany = function()
{
	this.notifyBackendEIMOPaidRepairCompany();
};

CharacterScreenDatasource.prototype.notifyBackendEIMOPaidRepairCompany = function ()
{
	SQ.call(this.mSQHandle, 'EIMO.jsPaidRepairCompany');
};

CharacterScreenDatasource.prototype.EIMOsetSelectedBrother = function(_entityId)
{
	this.EIMOnotifyBackendSetSelectedBrother(_entityId);
};

CharacterScreenDatasource.prototype.EIMOnotifyBackendSetSelectedBrother = function (_entityId)
{
	SQ.call(this.mSQHandle, 'EIMO.setSelectedBrother',_entityId);
};

CharacterScreenDatasource.prototype.EIMOgetRepairButtonData = function(_callback)
{
	this.EIMOnotifyBackendgetRepairButtonData(_callback);
};

CharacterScreenDatasource.prototype.EIMOnotifyBackendgetRepairButtonData = function (_callback)
{
	SQ.call(this.mSQHandle, 'EIMOgetRepairButtonData', null, _callback);
};

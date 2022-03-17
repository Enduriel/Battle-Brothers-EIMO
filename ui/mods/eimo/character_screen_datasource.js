CharacterScreenDatasource.prototype.EIMOnotifyBackendGetSettings = function (_callback)
{
	SQ.call(this.mSQHandle, 'EIMOJSgetSettings', null, _callback);
}

CharacterScreenDatasource.prototype.EIMOratioRepairButtonClicked = function()
{
	this.EIMOnotifyBackendRatioRepairButtonClicked();
};

CharacterScreenDatasource.prototype.EIMOnotifyBackendRatioRepairButtonClicked = function ()
{
	SQ.call(this.mSQHandle, 'EIMOJSonRatioRepairButtonClicked');
};

CharacterScreenDatasource.prototype.EIMOratioSalvageButtonClicked = function()
{
	this.EIMOnotifyBackendRatioSalvageButtonClicked();
};

CharacterScreenDatasource.prototype.EIMOnotifyBackendRatioSalvageButtonClicked = function ()
{
	SQ.call(this.mSQHandle, 'EIMOJSonRatioSalvageButtonClicked');
};

CharacterScreenDatasource.prototype.EIMOsetForSaleInventoryItem = function(_itemId, _callback)
{
	this.EIMOnotifyBackendSetForSaleInventoryItem(_itemId, _callback);
};

CharacterScreenDatasource.prototype.EIMOnotifyBackendSetForSaleInventoryItem = function (_sourceItemId, _callback)
{
	SQ.call(this.mSQHandle, 'EIMOJSonSetForSaleInventoryItem', _sourceItemId, _callback);
};

CharacterScreenDatasource.prototype.EIMOfavoriteInventoryItem = function(_itemId, _callback)
{
	this.EIMOnotifyBackendFavoriteInventoryItem(_itemId, _callback);
};

CharacterScreenDatasource.prototype.EIMOnotifyBackendFavoriteInventoryItem = function (_sourceItemId, _callback)
{
	SQ.call(this.mSQHandle, 'EIMOJSonFavoriteInventoryItem', _sourceItemId, _callback);
};

CharacterScreenDatasource.prototype.EIMOpaidRepairBrother = function()
{
	this.EIMOnotifyBackendPaidRepairBrother();
};

CharacterScreenDatasource.prototype.EIMOnotifyBackendPaidRepairBrother = function ()
{
	SQ.call(this.mSQHandle, 'EIMOJSpaidRepairBrother');
};

CharacterScreenDatasource.prototype.EIMOpaidRepairCompany = function()
{
	this.notifyBackendEIMOPaidRepairCompany();
};

CharacterScreenDatasource.prototype.notifyBackendEIMOPaidRepairCompany = function ()
{
	SQ.call(this.mSQHandle, 'EIMOJSpaidRepairCompany');
};

CharacterScreenDatasource.prototype.EIMOsetSelectedBrother = function(_entityId)
{
	this.EIMOnotifyBackendSetSelectedBrother(_entityId);
};

CharacterScreenDatasource.prototype.EIMOnotifyBackendSetSelectedBrother = function (_entityId)
{
	SQ.call(this.mSQHandle, 'EIMOJSsetSelectedBrother',_entityId);
};

CharacterScreenDatasource.prototype.EIMOgetRepairData = function(_callback)
{
	this.EIMOnotifyBackendgetRepairData(_callback);
};

CharacterScreenDatasource.prototype.EIMOnotifyBackendgetRepairData = function (_callback)
{
	SQ.call(this.mSQHandle, 'EIMOJSgetRepairData', null, _callback);
};

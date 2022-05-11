CharacterScreenDatasource.prototype.EIMOratioRepairButtonClicked = function()
{
	this.EIMOnotifyBackendRatioRepairButtonClicked();
};

CharacterScreenDatasource.prototype.EIMOnotifyBackendRatioRepairButtonClicked = function ()
{
	SQ.call(this.mSQHandle, 'eimo_onRatioRepairButtonClicked');
};

CharacterScreenDatasource.prototype.EIMOratioSalvageButtonClicked = function()
{
	this.EIMOnotifyBackendRatioSalvageButtonClicked();
};

CharacterScreenDatasource.prototype.EIMOnotifyBackendRatioSalvageButtonClicked = function ()
{
	SQ.call(this.mSQHandle, 'eimo_onRatioSalvageButtonClicked');
};

CharacterScreenDatasource.prototype.EIMOsetForSaleInventoryItem = function(_itemId, _callback)
{
	this.EIMOnotifyBackendSetForSaleInventoryItem(_itemId, _callback);
};

CharacterScreenDatasource.prototype.EIMOnotifyBackendSetForSaleInventoryItem = function (_sourceItemId, _callback)
{
	SQ.call(this.mSQHandle, 'eimo_onSetForSaleInventoryItem', _sourceItemId, _callback);
};

CharacterScreenDatasource.prototype.EIMOfavoriteInventoryItem = function(_itemId, _callback)
{
	this.EIMOnotifyBackendFavoriteInventoryItem(_itemId, _callback);
};

CharacterScreenDatasource.prototype.EIMOnotifyBackendFavoriteInventoryItem = function (_sourceItemId, _callback)
{
	SQ.call(this.mSQHandle, 'eimo_onFavoriteInventoryItem', _sourceItemId, _callback);
};

CharacterScreenDatasource.prototype.EIMOpaidRepairBrother = function()
{
	this.EIMOnotifyBackendPaidRepairBrother();
};

CharacterScreenDatasource.prototype.EIMOnotifyBackendPaidRepairBrother = function ()
{
	SQ.call(this.mSQHandle, 'eimo_paidRepairBrotherFromJS');
};

CharacterScreenDatasource.prototype.EIMOpaidRepairCompany = function()
{
	this.notifyBackendEIMOPaidRepairCompany();
};

CharacterScreenDatasource.prototype.notifyBackendEIMOPaidRepairCompany = function ()
{
	SQ.call(this.mSQHandle, 'eimo_paidRepairCompanyFromJS');
};

CharacterScreenDatasource.prototype.EIMOsetSelectedBrother = function(_entityId)
{
	this.EIMOnotifyBackendSetSelectedBrother(_entityId);
};

CharacterScreenDatasource.prototype.EIMOnotifyBackendSetSelectedBrother = function (_entityId)
{
	SQ.call(this.mSQHandle, 'eimo_setSelectedBrother',_entityId);
};

CharacterScreenDatasource.prototype.EIMOgetRepairData = function(_callback)
{
	this.EIMOnotifyBackendgetRepairData(_callback);
};

CharacterScreenDatasource.prototype.EIMOnotifyBackendgetRepairData = function (_callback)
{
	SQ.call(this.mSQHandle, 'eimo_getRepairData', null, _callback);
};

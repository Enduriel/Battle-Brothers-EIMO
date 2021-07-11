{
	CharacterScreenDatasource.prototype.notifyBackendEIMOgetSettings = function (_callback)
	{
		SQ.call(this.mSQHandle, 'EIMOgetSettings', null, _callback);
	}

	CharacterScreenDatasource.prototype.notifyBackendEIMOsetSettings = function(_data)
	{
		SQ.call(this.mSQHandle, "EIMOsetSettings", _data);
	}

	CharacterScreenDatasource.prototype.notifyBackendEIMOsetSettingsVisibility = function(_data)
	{
		SQ.call(this.mSQHandle, "EIMOsetSettingsVisibility", _data);
	}

	CharacterScreenDatasource.prototype.repairAllButtonClicked = function(_itemId, _callback)
	{
	   this.notifyBackendRepairAllButtonClicked(_itemId, _callback);
	};

	CharacterScreenDatasource.prototype.EIMOchangeVisibilityButtonClicked = function(_itemId, _callback)
	{
		this.notifyBackendEIMOonChangeVisibilityButtonClicked(_itemId, _callback);
		this.setVisibilityLevel();
	};

	CharacterScreenDatasource.prototype.notifyBackendEIMOonChangeVisibilityButtonClicked = function (_sourceItemId, _callback)
	{
		SQ.call(this.mSQHandle, 'EIMOonChangeVisibilityButtonClicked', _sourceItemId, _callback);
	};

	CharacterScreenDatasource.prototype.notifyBackendRepairAllButtonClicked = function (_sourceItemId, _callback)
	{
		SQ.call(this.mSQHandle, 'onRepairAllButtonClicked', _sourceItemId, _callback);
	};

	CharacterScreenDatasource.prototype.notifyBackendSetForSaleInventoryItem = function (_sourceItemId, _callback)
	{
		SQ.call(this.mSQHandle, 'onSetForSaleInventoryItem', _sourceItemId, _callback);
	};

	CharacterScreenDatasource.prototype.notifyBackendFavoriteInventoryItem = function (_sourceItemId, _callback)
	{
		SQ.call(this.mSQHandle, 'onFavoriteInventoryItem', _sourceItemId, _callback);
	};
}
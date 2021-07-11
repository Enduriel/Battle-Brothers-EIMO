{
	CharacterScreenDatasource.prototype.notifyBackendEIMOgetSettings = function (_callback)
	{
		SQ.call(this.mSQHandle, 'EIMOgetSettings', null, _callback);
	}

	CharacterScreenDatasource.prototype.notifyBackendEIMOsetSettings = function(_data)
	{
		SQ.call(this.mSQHandle, "EIMOsetSettings", _data);
	}

	CharacterScreenDatasource.prototype.notifyBackendEIMOsetVisible = function(_data)
	{
		SQ.call(this.mSQHandle, "EIMOsetVisible", _data);
	}

	CharacterScreenDatasource.prototype.notifyBackendEIMOsetSettingsVisibility = function(_data)
	{
		SQ.call(this.mSQHandle, "EIMOsetSettingsVisibility", _data);
	}

	CharacterScreenDatasource.prototype.EIMOrepairAllButtonClicked = function(_itemId, _callback)
	{
	   this.notifyBackendEIMORepairAllButtonClicked(_itemId, _callback);
	};

	CharacterScreenDatasource.prototype.notifyBackendEIMORepairAllButtonClicked = function (_sourceItemId, _callback)
	{
		SQ.call(this.mSQHandle, 'onRepairAllButtonClicked', _sourceItemId, _callback);
	};

	CharacterScreenDatasource.prototype.EIMOchangeVisibilityButtonClicked = function(_itemId, _callback)
	{
		this.notifyBackendEIMOonChangeVisibilityButtonClicked(_itemId, _callback);
		this.EIMOgetVisibilityLevel();
	};

	CharacterScreenDatasource.prototype.notifyBackendEIMOonChangeVisibilityButtonClicked = function (_sourceItemId, _callback)
	{
		SQ.call(this.mSQHandle, 'EIMOonChangeVisibilityButtonClicked', _sourceItemId, _callback);
	};

	CharacterScreenDatasource.prototype.EIMOgetVisibilityLevel = function ()
	{
		var self = this;
		var temp;
		this.notifyBackendgetVisibilityLevel(function(result){
			var temp = result
			self.EIMOaftergetVisibility(temp);
		});
	};

	CharacterScreenDatasource.prototype.EIMOaftergetVisibility = function (data)
	{
		EIMOGlobalVisibilityLevel = data;
		this.notifyEventListener(CharacterScreenDatasourceIdentifier.Inventory.StashLoaded, this.mStashList);
	}

	CharacterScreenDatasource.prototype.notifyBackendgetVisibilityLevel = function (_callback)
	{
		SQ.call(this.mSQHandle, 'EIMOgetVisibilityLevel', null, _callback);
	}

	CharacterScreenDatasource.prototype.EIMOsetForSaleInventoryItem = function(_itemId, _callback)
	{
	   this.notifyBackendEIMOSetForSaleInventoryItem(_itemId, _callback);
	};

	CharacterScreenDatasource.prototype.notifyBackendEIMOSetForSaleInventoryItem = function (_sourceItemId, _callback)
	{
		SQ.call(this.mSQHandle, 'onSetForSaleInventoryItem', _sourceItemId, _callback);
	};

	CharacterScreenDatasource.prototype.EIMOfavoriteInventoryItem = function(_itemId, _callback)
	{
	   this.notifyBackendEIMOFavoriteInventoryItem(_itemId, _callback);
	};

	CharacterScreenDatasource.prototype.notifyBackendEIMOFavoriteInventoryItem = function (_sourceItemId, _callback)
	{
		SQ.call(this.mSQHandle, 'onFavoriteInventoryItem', _sourceItemId, _callback);
	};
}
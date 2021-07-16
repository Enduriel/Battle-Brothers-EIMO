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

	CharacterScreenDatasource.prototype.ChangeVisibilityButtonClicked = function(_itemId, _callback)
	{
		this.notifyBackendChangeVisibilityButtonClicked(_itemId, _callback);
		this.EIMOgetVisibilityLevel();
	};

	CharacterScreenDatasource.prototype.notifyBackendChangeVisibilityButtonClicked = function (_sourceItemId, _callback)
	{
		SQ.call(this.mSQHandle, 'ChangeVisibilityButtonClicked', _sourceItemId, _callback);
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

	CharacterScreenDatasource.prototype.EIMOpaidRepairBrother = function()
	{
		this.notifyBackendEIMOPaidRepairBrother();
	};

	CharacterScreenDatasource.prototype.notifyBackendEIMOPaidRepairBrother = function ()
	{
		SQ.call(this.mSQHandle, 'EIMOjspaidRepairBrother');
	};

	CharacterScreenDatasource.prototype.EIMOpaidRepairCompany = function()
	{
		this.notifyBackendEIMOPaidRepairCompany();
	};

	CharacterScreenDatasource.prototype.notifyBackendEIMOPaidRepairCompany = function ()
	{
		SQ.call(this.mSQHandle, 'EIMOjspaidRepairCompany');
	};

	CharacterScreenDatasource.prototype.EIMOsetSelectedBrother = function(_entityId)
	{
		this.notifyBackendEIMOSetSelectedBrother(_entityId);
	};

	CharacterScreenDatasource.prototype.notifyBackendEIMOSetSelectedBrother = function (_entityId)
	{
		SQ.call(this.mSQHandle, 'EIMOsetSelectedBrother',_entityId);
	};

	CharacterScreenDatasource.prototype.EIMOgetRepairButtonData = function(_callback)
	{
		this.notifyBackendEIMOgetRepairButtonData(_callback);
	};

	CharacterScreenDatasource.prototype.notifyBackendEIMOgetRepairButtonData = function (_callback)
	{
		SQ.call(this.mSQHandle, 'EIMOgetRepairButtonData', null, _callback);
	};
}
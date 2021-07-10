{
	CharacterScreenDatasource.prototype.notifyBackendEIMOgetSettings = function (_callback)
	{
		SQ.call(this.mSQHandle, 'EIMOgetSettings', null, _callback);
	}

	CharacterScreenDatasource.prototype.notifyBackendEIMOsetSettings = function(_data)
	{
		SQ.call(this.mSQHandle, "EIMOsetSettings", _data);
	}
}
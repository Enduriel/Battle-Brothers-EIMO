EIMO.SQConnection = function() {
	MSUBackendConnection.call(this);
}

EIMO.SQConnection.prototype = Object.create(MSUBackendConnection.prototype);
Object.defineProperty(EIMO.SQConnection.prototype, 'constructor', {
	value: EIMO.SQConnection,
	enumerable: false,
	writable: true
});

EIMO.SQConnection.prototype.setForSaleItemID = function(_instanceId, _callback)
{
	SQ.call(this.mSQHandle, 'onSetForSaleItemID', _instanceId, _callback);
}

EIMO.SQConnection.prototype.favoriteItem = function(_instanceId, _callback)
{
	SQ.call(this.mSQHandle, 'onFavoriteItem', _instanceId, _callback);
}

EIMO.SQConnection.prototype.favoriteItemID = function( _instanceId, _callback)
{
	SQ.call(this.mSQHandle, 'onFavoriteItemID', _instanceId, _callback);
}

registerScreen("EIMOConnection", new EIMO.SQConnection());

var eimo_CharacterScreen_show = CharacterScreen.prototype.show;
CharacterScreen.prototype.show = function(_data)
{
	eimo_CharacterScreen_show.call(this, _data);
	if (!this.mDataSource.isTacticalMode() && MSU.getSettingValue(EIMO.ID, EIMO.InventoryAddonsID))
	{
		this.mRightPanelModule.mHeaderModule.EIMOshow(_data);
	}
	else
	{
		this.mRightPanelModule.mHeaderModule.EIMOhide();
	}
}

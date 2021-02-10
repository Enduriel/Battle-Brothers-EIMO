{
	TacticalCombatResultScreenDatasource.prototype.notifyBackendSmartLootButtonPressed = function ()
	{
		var self = this;
		SQ.call(this.mSQHandle, 'onSmartLootButtonPressed', null, function(_data){
			self.loadFromData(_data);
		});
	};

	var tcDestroyDIV = TacticalCombatResultScreenLootPanel.prototype.destroyDIV;
	TacticalCombatResultScreenLootPanel.prototype.destroyDIV = function ()
	{
		tcDestroyDIV.call(this);

		this.mSmartLootButton.remove();
		this.mSmartLootButton = null;
	};

	var tcRemoveItemFromSlot = TacticalCombatResultScreenLootPanel.prototype.removeItemFromSlot;
	TacticalCombatResultScreenLootPanel.prototype.removeItemFromSlot = function(_slot)
	{
		_slot.setMarkcImageVisible(false);
		_slot.setFavoriteImageVisible(false);
		_slot.setDratioVisible(null,"#ffffff");
		tcRemoveItemFromSlot.call(this, _slot);
	};

	var tcAssignItemToSlot = TacticalCombatResultScreenLootPanel.prototype.assignItemToSlot;
	TacticalCombatResultScreenLootPanel.prototype.assignItemToSlot = function(_owner, _slot, _item)
	{
		tcAssignItemToSlot.call(this, _owner, _slot, _item);
		if(!('id' in _item) || !('imagePath' in _item))
		{
		}
		else
		{
			var itemData = _slot.data('item');
			itemData.repair = _item.repair;
			itemData.markc = _item.markc;
			itemData.favorite = _item.favorite;
			var dratioa = Math.floor(_item.dratio);
			switch (EIMOGlobalVisibilityLevel)
			{
				case 1:
					_slot.setMarkcImageVisible(_item.markc);
					_slot.setFavoriteImageVisible(_item.favorite);
					break;
				case 2:
					break;
				case 0: default:
					_slot.setMarkcImageVisible(_item.markc);
					_slot.setFavoriteImageVisible(_item.favorite);
					if(_item.showDratio === true && _item[CharacterScreenIdentifier.Item.Amount] != '')
					{
						_slot.setDratioVisible('' + dratioa, _item[CharacterScreenIdentifier.Item.AmountColor]);
					}
			}
		}
	};

	tcBindTooltips = TacticalCombatResultScreenLootPanel.prototype.bindTooltips;
	TacticalCombatResultScreenLootPanel.prototype.bindTooltips = function()
	{
		tcBindTooltips.call(this);

		this.mSmartLootButton.bindTooltip({ contentType: 'ui-element', elementId: "tactical-combat-result-screen.loot-panel.SmartLootButton" });
	}
	
	tcUnbindTooltips = TacticalCombatResultScreenLootPanel.prototype.unbindTooltips;
	TacticalCombatResultScreenLootPanel.prototype.unbindTooltips = function()
	{
		tcUnbindTooltips.call(this);

		this.mSmartLootButton.unbindTooltip();
	}

}
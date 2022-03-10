var charRemoveItemFromSlot = CharacterScreenInventoryListModule.prototype.removeItemFromSlot;
CharacterScreenInventoryListModule.prototype.removeItemFromSlot = function(_slot)
{
	_slot.setForSaleImageVisible(false);
	_slot.setFavoriteImageVisible(false);
	_slot.setRepairProfitVisible(null);
	charRemoveItemFromSlot.call(this, _slot);
}

var csAssignItemToSlot = CharacterScreenInventoryListModule.prototype.assignItemToSlot;
CharacterScreenInventoryListModule.prototype.assignItemToSlot = function(_entityId, _owner, _slot, _item)
{
	csAssignItemToSlot.call(this, _entityId, _owner, _slot, _item);
	if ((CharacterScreenIdentifier.Item.Id in _item) && (CharacterScreenIdentifier.Item.ImagePath in _item))
	{
		var itemData = _slot.data('item');
		itemData.forSale = _item.forSale;
		itemData.favorite = _item.favorite;
		itemData.repairProfit = Math.floor(_item.repairProfit === undefined ? 0 : _item.repairProfit);
		switch (getModSettingValue(EIMO.ID, EIMO.VisibilityLevelID))
		{
			case "Reduced":
				_slot.setForSaleImageVisible(_item.forSale);
				_slot.setFavoriteImageVisible(_item.favorite);
				break;
			case "Off":
				break;
			case "Normal": default:
				_slot.setForSaleImageVisible(_item.forSale);
				_slot.setFavoriteImageVisible(_item.favorite);
				if (_item.repairProfit != 0)
				{
					_slot.setRepairProfitVisible(itemData.repairProfit.toString(), _item[CharacterScreenIdentifier.Item.AmountColor]);
				}
		}
	}
};

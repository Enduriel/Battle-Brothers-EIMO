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
		itemData.EIMO = {};
		itemData.EIMO.forSale = _item.EIMO.forSale;
		itemData.EIMO.favorite = _item.EIMO.favorite;
		itemData.EIMO.repairProfit = Math.round(_item.EIMO.repairProfit === undefined ? 0 : _item.EIMO.repairProfit);
		switch (getModSettingValue(EIMO.ID, EIMO.VisibilityLevelID))
		{
			case "Reduced":
				_slot.setForSaleImageVisible(_item.EIMO.forSale);
				_slot.setFavoriteImageVisible(_item.EIMO.favorite);
				break;
			case "Off":
				break;
			case "Normal": default:
				_slot.setForSaleImageVisible(_item.EIMO.forSale);
				_slot.setFavoriteImageVisible(_item.EIMO.favorite);
				if (itemData.EIMO.repairProfit != 0 && itemData.EIMO.repairProfit !== undefined)
				{
					_slot.setRepairProfitVisible(itemData.EIMO.repairProfit.toString(), _item[CharacterScreenIdentifier.Item.AmountColor]);
				}
		}
	}
};

::mods_hookExactClass("ui/screens/world/modules/world_town_screen/town_shop_dialog_module", function (o)
{
	o.eimo_onSellAllButtonClicked <- function()
	{
		local removedItem;
		local shopStash = this.m.Shop.getStash();

		for (local i = this.World.Assets.getStash().getCapacity() - 1; i >= 0 ; --i)
		{
			if (this.Stash.getItemAtIndex(i).item != null)
			{
				if (this.Stash.getItemAtIndex(i).item.eimo_shouldBeSold())
				{
					removedItem = this.Stash.removeByIndex(i);

					if (removedItem != null)
					{
						shopStash.add(removedItem)
						this.World.Assets.addMoney(removedItem.getSellPrice());
						if (removedItem.isBought())
						{
							removedItem.setBought(false);
						}
						else
						{
							removedItem.setSold(true);
						}

						if (removedItem.isItemType(this.Const.Items.ItemType.TradeGood))
						{
							this.World.Statistics.getFlags().increment("TradeGoodsSold");
						}
					}
				}
			}
		}

		local result = {
			Result = 0,
			Assets = this.m.Parent.queryAssetsInformation(),
			Shop = [],
			Stash = [],
			StashSpaceUsed = this.Stash.getNumberOfFilledSlots(),
			StashSpaceMax = this.Stash.getCapacity(),
			IsRepairOffered = this.m.Shop.isRepairOffered()
		}

		this.UIDataHelper.convertItemsToUIData(this.m.Shop.getStash().getItems(), result.Shop, this.Const.UI.ItemOwner.Shop);
		result.Stash = this.UIDataHelper.convertStashToUIData(false, this.m.InventoryFilter);

		if (this.World.Statistics.getFlags().has("TradeGoodsSold") && this.World.Statistics.getFlags().get("TradeGoodsSold") >= 10)
		{
			this.updateAchievement("Trader", 1, 1);
		}

		if (this.World.Statistics.getFlags().has("TradeGoodsSold") && this.World.Statistics.getFlags().get("TradeGoodsSold") >= 50)
		{
			this.updateAchievement("MasterTrader", 1, 1);
		}

		return result;
	}
});

local modID = "EndsInventoryManagementOverhaul";
::EIMOrepairThreshold <- 125;
::EIMOwaitUntilRepairedThreshold <- 175;
local visibilityLevel = 0;

::mods_registerMod(modID, 6.3,"End's Inventory Management Overhaul");


::mods_queue(null, null, function()
{
	local getDratio = function (item)
	{
		return item.m.Value * 0.15 / item.getConditionMax() * 20 * 15 / 250 * 120; 
	}

	local getVisibilityLevelFlag = function ()
	{
		return modID + ".visibilityLevel";
	}

	local getStashIndexFlag = function (i)
	{
		return modID + "." + i + ".indexFavorited";
	}

	local getItemSaleFlag = function (item)
	{
		return modID + "." + item.getID()+ item.getName() + ".forsale";
	}

	::mods_registerJS("mod_EIMO.js");
	::mods_registerJS("mod_EIMO_nohook.js");
	::mods_registerCSS("mod_EIMO.css");

	::mods_registerJS("smart_sort/mod_EIMO_smart_sort.js");
	::mods_registerJS("smart_sort/mod_EIMO_smart_sort_nohook.js");
	::mods_registerCSS("smart_sort/mod_EIMO_smart_sort.css");
	
	::mods_hookClass("items/item", function ( o )
	{
		o.m.isFavorite <- false;
	});

	::mods_hookClass("items/item", function ( o )
	{
		while(!("getTooltip" in o)) o = o[o.SuperName];
		local getTooltip = o.getTooltip;
		o.getTooltip = function()
		{
			local result = getTooltip();
			if (this.World.Flags.has(getItemSaleFlag(this)) && this.World.Flags.get(getItemSaleFlag(this)) == 1)
			{
				result.push({
					id = 99,
					type = "hint",
					icon = "ui/icons/EIMO_money_icon.png",
					text = "For sale"
				});
			}
			if(this.m.isFavorite)
			{
				result.push({
					id = 100,
					type = "hint",
					
					icon = "ui/icons/EIMO_favorite_icon.png",
					text = "Favorited"
				});
			}
			if(this.getItemType() < this.Const.Items.ItemType.Ammo)
			{
				result.push({
					id = 101,
					type = "hint",
					icon = "ui/icons/asset_supplies.png",
					text = this.Math.floor(getDratio(this)) + ""
				});
			}
			return result;
		}
	});

	::mods_hookNewObjectOnce("states/world_state", function ( o )
	{
		local onSerialize = o.onSerialize;
		o.onSerialize = function( _out )
		{
			//this.logInfo("Serializing");
			local items = this.m.Assets.getStash().getItems();
			
			this.World.Flags.set(getVisibilityLevelFlag(), visibilityLevel);

			for( local i = 0; i != items.len(); i = ++i )
			{
				local item = items[i];
				if (item != null && item.m.isFavorite )
				{
					this.World.Flags.set( getStashIndexFlag(i), 1);
					//this.logInfo("item: " + item.getID() + " at index "+ i +" saved as favorite.");
				}
				else
				{
					this.World.Flags.set( getStashIndexFlag(i), 0);
				}
			}
			onSerialize( _out );
		}

		local onDeserialize = o.onDeserialize;
		o.onDeserialize = function( _in )
		{	
			//this.logInfo("Deserializing");
			onDeserialize( _in );
			local items = this.m.Assets.getStash().getItems();
			
			if(this.World.Flags.has(getVisibilityLevelFlag()) && this.World.Flags.get(getVisibilityLevelFlag()) >= 0)
			{
				visibilityLevel = this.World.Flags.get(getVisibilityLevelFlag());
			}
			else
			{
				visibilityLevel = 0;
			}

			for( local i = 0; i != items.len(); i = ++i )
			{
				local item = items[i];
				
				if (item == null || !this.World.Flags.has( getStashIndexFlag(i) ) || this.World.Flags.get( getStashIndexFlag(i) ) == 0)
				{
				}
				else if (this.World.Flags.get( getStashIndexFlag(i) ) == 1)
				{
					//this.logInfo("item: " + item.getID() + " at index "+ i +" loaded as favorite.");
					item.m.isFavorite = true;
					this.World.Flags.set( getStashIndexFlag(i) , 0);
				}
			}
		}
	});

	::mods_hookNewObjectOnce("ui/global/data_helper", function ( o )
	{
		local convertItemToUIData = o.convertItemToUIData;
		o.convertItemToUIData = function ( _item, _forceSmallIcon, _owner = null )
		{
			if (_item == null)
			{
				return null;
			}

			local result = convertItemToUIData(_item, _forceSmallIcon, _owner);
			
			if (_item != null && _item.getItemType() < this.Const.Items.ItemType.Ammo)
			{
				result.showDratio <- true;
			}
			else
			{
				result.showDratio <- false;
			}
			result.dratio <- getDratio(_item);

			if (_item == null || !this.World.Flags.has(getItemSaleFlag(_item)) || this.World.Flags.get(getItemSaleFlag(_item)) == 0)
			{
				//this.logDebug("itemid false "+ itemid);
				result.markc <- false;
			}
			else
			{
				//this.logDebug("itemid true "+ itemid);
				result.markc <- true;
			}

			if (_item.m.isFavorite)
			{
				result.favorite <- true;
			}
			else
			{
				result.favorite <- false;
			}

			return result;

		}
	});

	::mods_hookNewObjectOnce("ui/screens/tooltip/tooltip_events", function(o) {
	  local queryTooltipData = o.general_queryUIElementTooltipData;
	  o.general_queryUIElementTooltipData = function(entityId, elementId, elementOwner)
	  {
		local tooltip = queryTooltipData(entityId, elementId, elementOwner);
		if(tooltip != null) return tooltip;
		if(elementId == "character-screen.right-panel-header-module.DrepairButton")
		{
		  return [
			{
			  id = 1,
			  type = "title",
			  text = "Mark All Worthy Items For Repair"
			},
			{
			  id = 2,
			  type = "description",
			  text = "It marks all the repairable items in your inventory with high enough ratio for repair."
			},
			{
				id = 3,
				type = "hint",
				icon = "ui/icons/EIMO_mouse_right_button_shift.png",
				text = "Side note: shift-click on items to mark their type for sale"
			}
			,
			{
				id = 4,
				type = "hint",
				icon = "ui/icons/EIMO_mouse_right_button_ctrl_shift.png",
				text = "Side note: ctrl-shift-click on items to mark them as favorite (they will then not be sold)"
			}
		  ];
		}
		else if(elementId == "character-screen.right-panel-header-module.ChangeVisibilityButton")
		{
		  return [
			{
			  id = 1,
			  type = "title",
			  text = "Cycle Visbility of EIMO Info"
			},
			{
			  id = 2,
			  type = "description",
			  text = "Cycles through 3 different levels of visibility for EIMO Info"
			}
		  ];
		}
		else if(elementId == "character-screen.right-panel-header-module.SellAllButton")
		{
		  return [
				{
				  id = 1,
				  type = "title",
				  text = "Sell All Loot"
				},
				{
				  	id = 2,
				  	type = "description",
				  	text = "Sell all items marked for sale. Favorited items will be ignored, even if marked for sale. Items with ratio 175+ will only be sold when in full condition."
				}
		  	];
		} else if(elementId == "tactical-combat-result-screen.loot-panel.SmartLootButton")
		{
			return [
				{
					id = 1,
					type = "title",
					text = "Smart Loot"
				},
				{
					id = 2,
					type = "description",
					text = "Intelligently loot all items including moving items from player inventory and automatically adding consumables to their totals."
				}
			];
		}
		return null;
	  }
	});

	::mods_hookNewObjectOnce("ui/screens/character/character_screen", function(o) {
	  
		o.onFavoriteInventoryItem <- function(itemID)
		{
			local item = this.World.Assets.getStash().getItemByInstanceID(itemID).item;
			
			if (item.m.isFavorite)
			{
				item.m.isFavorite = false;
			}
			else
			{
				item.m.isFavorite = true;
			}
			return true;
		}
		
		o.onRepairAllButtonClicked <- function()
		{
			local items = this.World.Assets.getStash().getItems();
				foreach( item in items )
				{
					if (item != null && item.getItemType() < this.Const.Items.ItemType.Ammo && item.getCondition() < item.getConditionMax())
					{
						local dratio = getDratio(item);
						if (dratio > ::EIMOrepairThreshold)
						{
							item.setToBeRepaired(true);
						}
					}
				}
				this.loadStashList();
		}

		o.onSetForSaleInventoryItem <- function(data)
		{
			
			local item = this.World.Assets.getStash().getItemByInstanceID(data).item;
			if (item != null)
			{
				if (!this.World.Flags.has(getItemSaleFlag(item)) || this.World.Flags.get(getItemSaleFlag(item)) == 0)
				{
					this.World.Flags.set(getItemSaleFlag(item), 1);
					this.loadStashList();
					return true;
				}
				else if (item != null && this.World.Flags.get(getItemSaleFlag(item)) == 1)
				{
					this.World.Flags.set(getItemSaleFlag(item), 0);
					this.loadStashList();
					return true;
				}
			}
			else
			{
				return false;
			}
		}

		o.EIMOonChangeVisibilityButtonClicked <- function ()
		{
			switch (visibilityLevel) 
			{
			    case 0: case 1:
			        visibilityLevel = visibilityLevel + 1;
			        break;
			   	case 2: default:
			   		visibilityLevel = 0;
			}

			//this.logInfo("visibility changed to:" + visibilityLevel);
			return visibilityLevel;
		}


		o.EIMOgetVisibilityLevel <- function ()
		{
		  	//this.logInfo("visibility get:" + visibilityLevel);
		  	return visibilityLevel;
		}

		o.logSomething <- function (data)
		{
			this.logInfo("debugged: " + data);
		}
	});

	::mods_hookClass("ui/screens/world/modules/world_town_screen/town_shop_dialog_module", function ( o )
	{
		o.onSellAllButtonClicked <- function()
		{
			if (this.Tactical.isActive())
			{
				
			}
			else
			{
				local dratio = 0;
				local item = null;
				local itemid = null;
				local removedItem = null;
				local shopStash = this.m.Shop.getStash();
				for( local i = this.World.Assets.getStash().getCapacity() - 1; i >= 0; i = --i )
				{
					if (this.Stash.getItemAtIndex(i).item == null)
					{
					}
					else
					{
						item = this.Stash.getItemAtIndex(i).item;
						//this.logDebug("item "+ item + " "+ i);
						itemid = item.getID() + item.getName();
						dratio = getDratio(item);
						if (!this.World.Flags.has(getItemSaleFlag(item)) || this.World.Flags.get(getItemSaleFlag(item)) == 0 || item.m.isFavorite)
						{
						}
						else if (item.getCondition() < item.getConditionMax() && dratio > ::EIMOwaitUntilRepairedThreshold)
						{
						}
						else
						{
							//this.logDebug("itemid true "+ itemid + " "+ i);
							removedItem = this.Stash.removeByIndex(i);

							if (removedItem != null)
							{
								this.World.Assets.addMoney(removedItem.getSellPrice());
								shopStash.add(removedItem);

								if(removedItem.isBought())
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
				};

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
		}

		o.EIMOgetVisibilityLevel <- function ()
		{
			return visibilityLevel;
		}

		o.logSomething <- function (data)
		{
			this.logInfo("debugged: " + data);
		}
	});

});




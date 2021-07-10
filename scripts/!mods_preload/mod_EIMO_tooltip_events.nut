this.getroottable().Const.EIMO.hookTooltipEvents <- function()
{
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
					text = "Mark Items For Repair"
				},
				{
					id = 2,
					type = "description",
					text = "Marks all worthwile repairable items in your inventory for repair."
				},
				{
					id = 3,
					type = "hint",
					icon = "ui/icons/EIMO_mouse_right_button_shift.png",
					text = "Shift-click on items to mark their type for sale"
				},
				{
					id = 4,
					type = "hint",
					icon = "ui/icons/EIMO_mouse_right_button_ctrl_shift.png",
					text = "Ctrl-Shift-click on items to mark them as favorite (they will then not be sold)"
				}];
			}
			else if(elementId == "character-screen.right-panel-header-module.ChangeVisibilityButton")
			{
				return [
				{
					id = 1,
					type = "title",
					text = "Cycle Visibility of EIMO Info"
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
}
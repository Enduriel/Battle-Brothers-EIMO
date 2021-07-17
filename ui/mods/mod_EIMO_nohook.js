{
	CharacterScreenInventoryListModule.prototype.createItemSlot = function (_owner, _index, _parentDiv, _screenDiv)
	{
		var self = this;
		
		var result = _parentDiv.createListItem(false);
		result.attr('id', 'slot-index_' + _index);

		// update item data
		var itemData = result.data('item') || {};
		itemData.index = _index;
		itemData.owner = _owner;
		result.data('item', itemData);

		// add event handler
		var dropHandler = function (_source, _target, _proxy, _dd)
		{        
			if (_proxy.data('item') === undefined || _target.data('item') === undefined)
			{
				console.error("not an item!");
				return false;
			}

			if (_dd.offsetY > self.mSlotCountPanel.offset().top - 25)
				return false;

			//var sourceData = _source.data('item');
			var sourceData = _proxy.data('item');
			var targetData = _target.data('item');

			var sourceOwner = (sourceData !== null && 'owner' in sourceData) ? sourceData.owner : null;
			var targetOwner = (targetData !== null && 'owner' in targetData) ? targetData.owner : null;
			sourceData.isAllowedToDrop = false;
			_proxy.data('item', sourceData);

			if (sourceOwner === null || targetOwner === null)
			{
				//console.error('Failed to drop item. Owner are invalid.');
				return;
			}

			var entityId = (sourceData !== null && 'entityId' in sourceData) ? sourceData.entityId : null;
			var sourceItemId = (sourceData !== null && 'itemId' in sourceData) ? sourceData.itemId : null;
			var sourceItemIdx = (sourceData !== null && 'index' in sourceData) ? sourceData.index : null;
			var targetItemIdx = (targetData !== null && 'index' in targetData) ? targetData.index : null;
			var sourceSlotType = (sourceData !== null && 'slotType' in sourceData) ? sourceData.slotType : null;
			var targetSlotType = (targetData !== null && 'slotType' in targetData) ? targetData.slotType : null;
			var sourceIsBlockingOffhand = (sourceData !== null && 'isBlockingOffhand' in sourceData) ? sourceData.isBlockingOffhand : false;
			var targetIsBlockingOffhand = (targetData !== null && 'isBlockingOffhand' in targetData) ? targetData.isBlockingOffhand : false;

			if (sourceOwner !== CharacterScreenIdentifier.ItemOwner.Paperdoll)
			{
				if (sourceItemIdx === null)
				{
					//console.error('Failed to drop item. Source idx is invalid. #2');
					return;
				}
			}

			// don't allow swapping within the ground container
			if (sourceOwner === CharacterScreenIdentifier.ItemOwner.Ground &&
				targetOwner === CharacterScreenIdentifier.ItemOwner.Ground)
			{
				//console.error('Inventory::dropHandler: Ground item swapping not allowed!');
				return false;
			}

			if (sourceOwner === CharacterScreenIdentifier.ItemOwner.Stash &&
				targetOwner === CharacterScreenIdentifier.ItemOwner.Stash)
			{
				// don't allow swapping with same slot..
				if (sourceItemIdx === targetItemIdx)
				{
					//console.error('Inventory::dropHandler: Failed to drop item. Source idx is same as target idx.');
					return;
				}

				// allow drop animation
				sourceData.isAllowedToDrop = true;
				_proxy.data('item', sourceData);

				console.info('Stash -> Stash (swap)');
				self.mDataSource.swapInventoryItem(sourceItemIdx, targetItemIdx);
				return;
			}

			// enough APs ?
			if (self.mDataSource.hasEnoughAPToEquip() === false)
			{
				//console.error('Inventory::dropHandler: Not enough Action points!');
				return;
			}

			// from Paperdoll -> Stash | Ground
			if (sourceOwner === CharacterScreenIdentifier.ItemOwner.Paperdoll &&
				(targetOwner === CharacterScreenIdentifier.ItemOwner.Stash || targetOwner === CharacterScreenIdentifier.ItemOwner.Ground)
			   )
			{
				// NOTE: (js) check conditions
				var ignoreSlotType = false;

				// Special Case: Source = Twohander and Target = Offhand and Inventory = Stash and Main & Offhand are filled with Item and Stash = full
				if (sourceSlotType === CharacterScreenIdentifier.ItemSlot.Offhand && sourceIsBlockingOffhand === true)
				{
					//console.info('yay');
					ignoreSlotType = true;
				}

				// Same Slot type ?
				if (ignoreSlotType === false && targetSlotType !== null)
				{
					if (sourceSlotType !== targetSlotType)
					{
						//console.error('Inventory::dropHandler: Item must be the same slot type!');
						return;
					}
				}

				// allow drop animation
				sourceData.isAllowedToDrop = true;
				_proxy.data('item', sourceData);

				//console.info('Paperdoll -> Stash | Ground (targetIdx: ' + targetItemIdx + ')');
				self.mDataSource.dropPaperdollItem(entityId, sourceItemId, targetItemIdx);
				return;
			}

			// from Backpack -> Stash | Ground
			if (sourceOwner === CharacterScreenIdentifier.ItemOwner.Backpack &&
				(targetOwner === CharacterScreenIdentifier.ItemOwner.Stash || targetOwner === CharacterScreenIdentifier.ItemOwner.Ground)
				)
			{
				// don't allow helmets / armor within the bags
				if (targetSlotType === CharacterScreenIdentifier.ItemSlot.Head || targetSlotType === CharacterScreenIdentifier.ItemSlot.Body || targetSlotType === CharacterScreenIdentifier.ItemSlot.Accessory || targetSlotType === CharacterScreenIdentifier.ItemSlot.None)
				{
					//console.error('Inventory::dropHandler: Swapping with Head | Body into Backpack is not allowed!');
					return;
				}

				// allow drop animation
				sourceData.isAllowedToDrop = true;
				_proxy.data('item', sourceData);

				//console.info('Backpack -> Stash | Ground (targetIdx: ' + targetItemIdx + ')');
				self.mDataSource.dropBagItemIntoInventory(entityId, sourceItemId, sourceItemIdx, targetItemIdx);
			}
		};

		var dragEndHandler = function (_source, _target, _proxy)
		{   
			//var paperdollModule = $('.paperdoll-module');
			$(".is-equipable").each(function()
			{
				$(this).removeClass('is-equipable');
			});
			
			if (_source.length === 0 || _target.length === 0)
			{
				return false;
			}

			//var sourceData = _source.data('item');
			var sourceData = _proxy.data('item');
			var targetData = _target.data('item');

			var isAllowedToDrop = (sourceData !== null && 'isAllowedToDrop' in sourceData && targetData !== undefined && targetData !== null) ? sourceData.isAllowedToDrop : false;
			if (isAllowedToDrop === false)
			{
				//console.warn('Inventory::dragEndHandler: Failed to drop item. Not allowed.');
				return false;
			}

			var sourceOwner = (sourceData !== null && 'owner' in sourceData) ? sourceData.owner : null;
			var targetOwner = (targetData !== null && 'owner' in targetData) ? targetData.owner : null;
			//var itemIdx = (sourceData !== null && 'index' in sourceData) ? sourceData.index : null;
			var isEmpty = (targetData !== null && 'isEmpty' in targetData) ? targetData.isEmpty : true;

			// we don't allow swapping within the ground container
			if (sourceOwner === CharacterScreenIdentifier.ItemOwner.Ground && targetOwner === CharacterScreenIdentifier.ItemOwner.Ground)
			{
				console.error('Failed to swap item within ground container. Not allowed.');
				return false;
			}

			// we allow direct swapping within the stash container
			if (sourceOwner === CharacterScreenIdentifier.ItemOwner.Stash && targetOwner === CharacterScreenIdentifier.ItemOwner.Stash)
			{
				return true;
			}


			return true;
		};
		
		var dragStartHandler = function (_source, _proxy)
		{
			var paperdollModule = $('.paperdoll-module');
					
			if (_source.length === 0)
			{
				return false;
			}

			//var sourceData = _source.data('item');
			var sourceData = _proxy.data('item');
			//var proxyData = _source.data('item');
			var sourceSlotType = (sourceData !== null && 'slotType' in sourceData) ? sourceData.slotType : null;
			//console.log("Source data: " + sourceSlotType);       
				   
			switch (sourceSlotType)
			{
				case CharacterScreenIdentifier.ItemSlot.Mainhand:
					var leftColumn = paperdollModule.find('.equipment-column:first');
					var mainhandContainer = leftColumn.find('.ui-control.paperdoll-item.has-slot-frame.is-big:first');
					mainhandContainer.addClass('is-equipable');
					break;
				case CharacterScreenIdentifier.ItemSlot.Head:
					var middleColumn = paperdollModule.find('.equipment-column:eq(1)');
					var headContainer = middleColumn.find('.ui-control.paperdoll-item.has-slot-frame:first');
					headContainer.addClass('is-equipable');
					break;
				case CharacterScreenIdentifier.ItemSlot.Offhand:
					var rightColumn = paperdollModule.find('.equipment-column:eq(2)');
					var offhandContainer = rightColumn.find('.ui-control.paperdoll-item.has-slot-frame.is-big:first');
					offhandContainer.addClass('is-equipable');
					break;
				case CharacterScreenIdentifier.ItemSlot.Body:
					var middleColumn = paperdollModule.find('.equipment-column:eq(1)');
					var bodyArmorContainer = middleColumn.find('.ui-control.paperdoll-item.has-slot-frame.is-big:first');
					bodyArmorContainer.addClass('is-equipable');
					break;
				case CharacterScreenIdentifier.ItemSlot.Ammo:
					var rightColumn = paperdollModule.find('.equipment-column:eq(2)');
					var ammoContainer = rightColumn.find('.ui-control.paperdoll-item.has-slot-frame:first');
					ammoContainer.addClass('is-equipable');
					break;
				case CharacterScreenIdentifier.ItemSlot.Accessory:
					var leftColumn = paperdollModule.find('.equipment-column:first');
					var accessoryContainer = leftColumn.find('.ui-control.paperdoll-item.has-slot-frame:first');
					accessoryContainer.addClass('is-equipable');   
			}
			
			// if the item is not a head or armor piece, the item can go in the bag slots
			if (sourceData.isAllowedInBag === true)
			{
				$('div.l-backpack-row div.paperdoll-item.has-slot-frame').addClass('is-equipable');
			}
			
			/*
			console.info(sourceData);
			console.info(proxyData);
			*/

			return true;       
		};

		result.assignListItemDragAndDrop(_screenDiv, dragStartHandler, dragEndHandler, dropHandler); //_owner === CharacterScreenIdentifier.ItemOwner.Stash ? dropHandler : null);

		result.assignListItemRightClick(function (_item, _event)
		{
			var data = _item.data('item');

			var isEmpty = (data !== null && 'isEmpty' in data) ? data.isEmpty : true;
			//var owner = (data !== null && 'owner' in data) ? data.owner : null;
			var itemId = (data !== null && 'itemId' in data) ? data.itemId : null;
			var entityId = (data !== null && 'entityId' in data) ? data.entityId : null;
			var sourceItemIdx = (data !== null && 'index' in data) ? data.index : null;
			var dropIntoBag = (KeyModiferConstants.CtrlKey in _event && _event[KeyModiferConstants.CtrlKey] === true);
			var repairItem = (KeyModiferConstants.AltKey in _event && _event[KeyModiferConstants.AltKey] === true);
			var markitemforsale = (KeyModiferConstants.ShiftKey in _event && _event[KeyModiferConstants.ShiftKey] === true);
			var markItemAsFavorite = ((KeyModiferConstants.ShiftKey in _event && _event[KeyModiferConstants.ShiftKey] === true) && (KeyModiferConstants.CtrlKey in _event && _event[KeyModiferConstants.CtrlKey] === true));
			var sourceSlotType = (data !== null && 'slotType' in data) ? data.slotType : null;
			if (isEmpty === false && /*owner !== null &&*/ itemId !== null /*&& itemIdx !== null*/)
			{
				if (markItemAsFavorite === true)
				{
					self.mDataSource.EIMOfavoriteInventoryItem(itemId, function (retf)
					{
						if (retf)
						{
							data['favorite'] = !data['favorite'];
							result.setFavoriteImageVisible(data['favorite']);
						}
					});
				} 
				else if (markitemforsale === true)
				{
					self.mDataSource.EIMOsetForSaleInventoryItem(itemId, function(retu)
					{
						if (retu)
						{
							data['markc'] = !data['markc'];
							result.setMarkcImageVisible(data['markc']);
						}
					});
				}
				else if (dropIntoBag === true)
				{
					if (data.isAllowedInBag === false)
					{
						console.info('put item into bag: ' + itemId + ' not allowed for: ' + sourceSlotType);
						return;
					}

					self.mDataSource.dropInventoryItemIntoBag(entityId, itemId, sourceItemIdx, null);
				}
				else
				{
					if (repairItem === true)
					{
						self.mDataSource.toggleInventoryItem(itemId, null, function(ret)
						{
							data['repair'] = ret['repair'];
							data['salvage'] = ret['salvage'];
							result.setRepairImageVisible(data['repair'], data['salvage']);
							//result.setSalvageImageVisible(data['salvage']);
						})
					}
					else
					{
						self.mDataSource.equipInventoryItem(entityId, itemId, null);
					}
				}
			}
		});

		return result;
	};
	
}

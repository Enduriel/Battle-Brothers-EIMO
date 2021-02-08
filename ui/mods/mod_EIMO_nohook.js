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
					self.mDataSource.favoriteInventoryItem(itemId, function (retf)
					{
						if(retf)
						{
							data['favorite'] = !data['favorite'];
							result.setFavoriteImageVisible(data['favorite']);
						}
					});
				} 
				else if (markitemforsale === true)
				{
					self.mDataSource.setForSaleInventoryItem(itemId, function(retu)
					{
						if(retu)
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
						self.mDataSource.repairInventoryItem(itemId, function(ret)
						{
							if(ret)
							{
								data['repair'] = !data['repair'];
								result.setRepairImageVisible(data['repair']);
							}
						});
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
	
	CharacterScreenInventoryListModule.prototype.createDIV = function (_parentDiv)
	{
		var self = this; 


		// create: containers
		this.mContainer = $('<div class="inventory-list-module opacity-none"/>');
		//this.mContainer = $('<div class="inventory-list-module display-none"/>');
		_parentDiv.append(this.mContainer);

		var listContainerLayout = $('<div class="l-list-container"/>');
		this.mContainer.append(listContainerLayout);
		this.mListContainer = listContainerLayout.createList(1.24/*7.41*/, null, true);
		this.mListScrollContainer = this.mListContainer.findListScrollContainer();

		// slot & bro count
		this.mSlotCountPanel = $('<div class="slot-count-panel"/>');
		this.mContainer.append(this.mSlotCountPanel);
		
		this.mSlotCountContainer = $('<div class="slot-count-container"/>');
		this.mSlotCountPanel.append(this.mSlotCountContainer);
		var slotSizeImage = $('<img/>');
		slotSizeImage.attr('src', Path.GFX + Asset.ICON_BAG);
		this.mSlotCountContainer.append(slotSizeImage);
		this.mSlotCountLabel = $('<div class="label text-font-small font-bold font-color-value"/>');
		this.mSlotCountContainer.append(this.mSlotCountLabel);

		// sort
		this.mFilterPanel = $('<div class="filter-panel"/>');
		this.mSlotCountPanel.append(this.mFilterPanel);

		var layout = $('<div class="l-button is-mood-filter"/>');
		this.mFilterPanel.append(layout);
		this.mFilterMoodButton = layout.createImageButton(Path.GFX + Asset.BUTTON_MOOD_FILTER, function ()
		{
			if(self.mParent.mParent.mBrothersModule.toggleMoodVisibility())
				self.mFilterMoodButton.changeButtonImage(Path.GFX + Asset.BUTTON_MOOD_FILTER);
			else
				self.mFilterMoodButton.changeButtonImage(Path.GFX + Asset.BUTTON_MOOD_FILTER_OFF);
		}, '', 3);

		var layout = $('<div class="l-button is-sort"/>');
		this.mFilterPanel.append(layout);
		this.mSortInventoryButton = layout.createImageButton(Path.GFX + Asset.BUTTON_SORT, function ()
		{
			self.mDataSource.notifyBackendSortButtonClicked();
		}, '', 3);

		var layout = $('<div class="l-button is-all-filter"/>');
		this.mFilterPanel.append(layout);
		this.mFilterAllButton = layout.createImageButton(Path.GFX + Asset.BUTTON_ALL_FILTER, function ()
		{
			self.mFilterAllButton.addClass('is-active');
			self.mFilterWeaponsButton.removeClass('is-active');
			self.mFilterArmorButton.removeClass('is-active');
			self.mFilterMiscButton.removeClass('is-active');
			self.mFilterUsableButton.removeClass('is-active');
			self.mDataSource.notifyBackendFilterAllButtonClicked();
		}, '', 3);
		this.mFilterAllButton.addClass('is-active');

		var layout = $('<div class="l-button is-weapons-filter"/>');
		this.mFilterPanel.append(layout);
		this.mFilterWeaponsButton = layout.createImageButton(Path.GFX + Asset.BUTTON_WEAPONS_FILTER, function ()
		{
			self.mFilterAllButton.removeClass('is-active');
			self.mFilterWeaponsButton.addClass('is-active');
			self.mFilterArmorButton.removeClass('is-active');
			self.mFilterMiscButton.removeClass('is-active');
			self.mFilterUsableButton.removeClass('is-active');
			self.mDataSource.notifyBackendFilterWeaponsButtonClicked();
		}, '', 3);

		var layout = $('<div class="l-button is-armor-filter"/>');
		this.mFilterPanel.append(layout);
		this.mFilterArmorButton = layout.createImageButton(Path.GFX + Asset.BUTTON_ARMOR_FILTER, function ()
		{
			self.mFilterAllButton.removeClass('is-active');
			self.mFilterWeaponsButton.removeClass('is-active');
			self.mFilterArmorButton.addClass('is-active');
			self.mFilterMiscButton.removeClass('is-active');
			self.mFilterUsableButton.removeClass('is-active');
			self.mDataSource.notifyBackendFilterArmorButtonClicked();
		}, '', 3);

		var layout = $('<div class="l-button is-misc-filter"/>');
		this.mFilterPanel.append(layout);
		this.mFilterMiscButton = layout.createImageButton(Path.GFX + Asset.BUTTON_MISC_FILTER, function ()
		{
			self.mFilterAllButton.removeClass('is-active');
			self.mFilterWeaponsButton.removeClass('is-active');
			self.mFilterArmorButton.removeClass('is-active');
			self.mFilterMiscButton.addClass('is-active');
			self.mFilterUsableButton.removeClass('is-active');
			self.mDataSource.notifyBackendFilterMiscButtonClicked();
		}, '', 3);

		var layout = $('<div class="l-button is-usable-filter"/>');
		this.mFilterPanel.append(layout);
		this.mFilterUsableButton = layout.createImageButton(Path.GFX + Asset.BUTTON_USABLE_FILTER, function ()
		{
			self.mFilterAllButton.removeClass('is-active');
			self.mFilterWeaponsButton.removeClass('is-active');
			self.mFilterArmorButton.removeClass('is-active');
			self.mFilterMiscButton.removeClass('is-active');
			self.mFilterUsableButton.addClass('is-active');
			self.mDataSource.notifyBackendFilterUsableButtonClicked();
		}, '', 3);
		
		var layout = $('<div class="l-button is-drepair-filter"/>');
		this.mFilterPanel.append(layout);
		this.mDrepairButton = layout.createImageButton(Path.GFX + "ui/icons/EIMO_repair_button.png", function ()
		{
			self.mDataSource.repairAllButtonClicked();
		}, '', 3);

		var layout = $('<div class="l-button EIMO-visibility-level"/>');
		this.mFilterPanel.append(layout);
		this.mChangeVisibilityButton = layout.createImageButton(Path.GFX + "ui/icons/EIMO_cycle_button.png", function ()
		{
			self.mDataSource.EIMOchangeVisibilityButtonClicked();
		}, '', 3);

	};
	
	WorldTownScreenShopDialogModule.prototype.createDIV = function (_parentDiv)
	{
		var self = this;

		// create: containers (init hidden!)
		this.mContainer = $('<div class="l-shop-dialog-container display-none opacity-none"/>');
		_parentDiv.append(this.mContainer);
		this.mDialogContainer = this.mContainer.createDialog('', '', '', true, 'dialog-1024-768');

		// create tabs
		var tabButtonsContainer = $('<div class="l-tab-container"/>');
		this.mDialogContainer.findDialogTabContainer().append(tabButtonsContainer);
		
		//create assets
		this.mAssets.createDIV(tabButtonsContainer);

		// create content
		var content = this.mDialogContainer.findDialogContentContainer();

		// create stash
		var leftColumn = $('<div class="column is-left"/>');
		content.append(leftColumn);
		var headerRow = $('<div class="row is-header title-font-normal font-bold font-color-title">Stash</div>');
		leftColumn.append(headerRow);
		var contentRow = $('<div class="row is-content"/>');
		leftColumn.append(contentRow);
		var footerRow = $('<div class="row is-footer"/>');
		leftColumn.append(footerRow);

		var listContainerLayout = $('<div class="l-list-container is-left"></div>');
		contentRow.append(listContainerLayout);
		this.mStashListContainer = listContainerLayout.createList(1.24/*8.63*/);
		this.mStashListScrollContainer = this.mStashListContainer.findListScrollContainer();

		// create middle
		var middleColumn = $('<div class="column is-middle"/>');
		content.append(middleColumn);
		contentRow = $('<div class="row is-content"/>');
		middleColumn.append(contentRow);
		var buttonContainer = $('<div class="button-container"/>');
		contentRow.append(buttonContainer);

		// sort/filter
		var layout = $('<div class="l-button is-sort"/>');
		buttonContainer.append(layout);
		this.mSortInventoryButton = layout.createImageButton(Path.GFX + Asset.BUTTON_SORT, function()
		{
			self.notifyBackendSortButtonClicked();
		}, '', 3);

		var layout = $('<div class="l-button is-all-filter"/>');
		buttonContainer.append(layout);
		this.mFilterAllButton = layout.createImageButton(Path.GFX + Asset.BUTTON_ALL_FILTER, function()
		{
			self.mFilterAllButton.addClass('is-active');
			self.mFilterWeaponsButton.removeClass('is-active');
			self.mFilterArmorButton.removeClass('is-active');
			self.mFilterMiscButton.removeClass('is-active');
			self.mFilterUsableButton.removeClass('is-active');
			self.notifyBackendFilterAllButtonClicked();
		}, '', 3);
		self.mFilterAllButton.addClass('is-active');

		var layout = $('<div class="l-button is-weapons-filter"/>');
		buttonContainer.append(layout);
		this.mFilterWeaponsButton = layout.createImageButton(Path.GFX + Asset.BUTTON_WEAPONS_FILTER, function()
		{
			self.mFilterAllButton.removeClass('is-active');
			self.mFilterWeaponsButton.addClass('is-active');
			self.mFilterArmorButton.removeClass('is-active');
			self.mFilterMiscButton.removeClass('is-active');
			self.mFilterUsableButton.removeClass('is-active');
			self.notifyBackendFilterWeaponsButtonClicked();
		}, '', 3);

		var layout = $('<div class="l-button is-armor-filter"/>');
		buttonContainer.append(layout);
		this.mFilterArmorButton = layout.createImageButton(Path.GFX + Asset.BUTTON_ARMOR_FILTER, function()
		{
			self.mFilterAllButton.removeClass('is-active');
			self.mFilterWeaponsButton.removeClass('is-active');
			self.mFilterArmorButton.addClass('is-active');
			self.mFilterMiscButton.removeClass('is-active');
			self.mFilterUsableButton.removeClass('is-active');
			self.notifyBackendFilterArmorButtonClicked();
		}, '', 3);

		var layout = $('<div class="l-button is-misc-filter"/>');
		buttonContainer.append(layout);
		this.mFilterMiscButton = layout.createImageButton(Path.GFX + Asset.BUTTON_MISC_FILTER, function()
		{
			self.mFilterAllButton.removeClass('is-active');
			self.mFilterWeaponsButton.removeClass('is-active');
			self.mFilterArmorButton.removeClass('is-active');
			self.mFilterMiscButton.addClass('is-active');
			self.mFilterUsableButton.removeClass('is-active');
			self.notifyBackendFilterMiscButtonClicked();
		}, '', 3);

		var layout = $('<div class="l-button is-usable-filter"/>');
		buttonContainer.append(layout);
		this.mFilterUsableButton = layout.createImageButton(Path.GFX + Asset.BUTTON_USABLE_FILTER, function ()
		{
			self.mFilterAllButton.removeClass('is-active');
			self.mFilterWeaponsButton.removeClass('is-active');
			self.mFilterArmorButton.removeClass('is-active');
			self.mFilterMiscButton.removeClass('is-active');
			self.mFilterUsableButton.addClass('is-active');
			self.notifyBackendFilterUsableButtonClicked();
		}, '', 3);

		// sell_all
		var layout = $('<div class="l-button is-sellall"/>');
		buttonContainer.append(layout);
		this.mSellAllButton = layout.createImageButton(Path.GFX + Asset.ICON_ASSET_MONEY, function()
		{
			self.sellAllButtonClicked();
		}, '', 3);
		
		this.mStashSlotSizeContainer = $('<div class="slot-count-container"/>');
		buttonContainer.append(this.mStashSlotSizeContainer);
		var slotSizeImage = $('<img/>');
		slotSizeImage.attr('src', Path.GFX + Asset.ICON_BAG);
		this.mStashSlotSizeContainer.append(slotSizeImage);
		this.mStashSlotSizeLabel = $('<div class="label text-font-small font-bold font-color-value"/>');
		this.mStashSlotSizeContainer.append(this.mStashSlotSizeLabel);

		// create shop loot
		var rightColumn = $('<div class="column is-right"/>');
		content.append(rightColumn);
		headerRow = $('<div class="row is-header title-font-normal font-bold font-color-title">Shop</div>');
		rightColumn.append(headerRow);
		contentRow = $('<div class="row is-content"/>');
		rightColumn.append(contentRow);

		listContainerLayout = $('<div class="l-list-container is-right"></div>');
		contentRow.append(listContainerLayout);
		this.mShopListContainer = listContainerLayout.createList(1.24/*8.63*/);
		this.mShopListScrollContainer = this.mShopListContainer.findListScrollContainer();


		// create footer button bar
		var footerButtonBar = $('<div class="l-button-bar"/>');
		this.mDialogContainer.findDialogFooterContainer().append(footerButtonBar);

		// create: buttons
		var layout = $('<div class="l-leave-button"/>');
		footerButtonBar.append(layout);
		this.mLeaveButton = layout.createTextButton("Leave", function()
		{
			self.notifyBackendLeaveButtonPressed();
		}, '', 1);

		this.mIsVisible = false;

		this.setupEventHandler();
	};
}
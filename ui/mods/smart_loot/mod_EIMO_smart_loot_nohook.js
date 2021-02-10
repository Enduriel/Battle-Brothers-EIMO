{
    TacticalCombatResultScreenLootPanel.prototype.createDIV = function (_parentDiv)
    {
        var self = this;

        // create: loot panel (init hidden!)
        this.mContainer = $('<div class="loot-panel opacity-none"/>');
        _parentDiv.append(this.mContainer);

        // create stash
        var leftColumn = $('<div class="column is-left"/>');
        this.mContainer.append(leftColumn);
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

        // create options
        var middleColumn = $('<div class="column is-middle"/>');
        this.mContainer.append(middleColumn);
        contentRow = $('<div class="row is-content"/>');
        middleColumn.append(contentRow);

        this.mStashSlotSizeContainer = $('<div class="slot-count-container"/>');
        middleColumn.append(this.mStashSlotSizeContainer);
        var slotSizeImage = $('<img/>');
        slotSizeImage.attr('src', Path.GFX + Asset.ICON_BAG);
        this.mStashSlotSizeContainer.append(slotSizeImage);
        this.mStashSlotSizeLabel = $('<div class="label text-font-small font-bold font-color-value"/>');
        this.mStashSlotSizeContainer.append(this.mStashSlotSizeLabel);

        // create: buttons
        var buttonLayout = $('<div class="l-loot-all-items-button"/>');
        contentRow.append(buttonLayout);
        this.mLootAllItemsButton = buttonLayout.createCustomButton("", function ()
        {
            self.mDataSource.notifyBackendLootAllItemsButtonPressed();
        }, 'loot-all-button', 7);

        // create found loot
        var rightColumn = $('<div class="column is-right"/>');
        this.mContainer.append(rightColumn);
        headerRow = $('<div class="row is-header title-font-normal font-bold font-color-title">Found Loot</div>');
        rightColumn.append(headerRow);
        contentRow = $('<div class="row is-content"/>');
        rightColumn.append(contentRow);

        listContainerLayout = $('<div class="l-list-container is-right"></div>');
        contentRow.append(listContainerLayout);
        this.mFoundLootListContainer = listContainerLayout.createList(1.24/*8.63*/);
        this.mFoundLootListScrollContainer = this.mFoundLootListContainer.findListScrollContainer();


        //SortValueButton
        var buttonLayout = $('<div class="l-smart-loot-button"/>');
        middleColumn.append(buttonLayout);
        this.mSmartLootButton = buttonLayout.createCustomButton("", function ()
        {
            self.mDataSource.notifyBackendSmartLootButtonPressed();
        }, 'smart-loot-button', 7);



        this.setupEventHandler();
    };

}
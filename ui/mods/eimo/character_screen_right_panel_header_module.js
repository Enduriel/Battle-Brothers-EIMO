var createDiv = CharacterScreenRightPanelHeaderModule.prototype.createDIV;
CharacterScreenRightPanelHeaderModule.prototype.createDIV = function (_parentDiv)
{
	createDiv.call(this, _parentDiv);
	var self = this;

	this.mEIMO =
	{
		Buttons:
		{
			RatioRepairButton: null,
			RatioSalvageButton: null,
			RepairBrotherButton:
			{
				Enabled: false
			},
			RepairCompanyButton:
			{
				Enabled: false
			}
		},
		CurrentBrother: null,
		Legends: false,
		CanRepair: false
	};

	this.mEIMO.Buttons = $('<div class="EIMO-character-screen-buttons"/>')
	this.mContainer.append(this.mEIMO.Buttons);
	this.mEIMO.Buttons.append($('<div class="background"/>'));

	var content = $('<div class="column"/>');
	this.mEIMO.Buttons.append(content);

	var button = $('<div class="l-button repair"/>');
	content.append(button);
	this.mEIMO.Buttons.RatioRepairButton = button.createImageButton(Path.GFX + EIMO.BUTTON_REPAIR, function ()
	{
		self.mDataSource.EIMOratioRepairButtonClicked();
	}, '', 3);

	var button = $('<div class="l-button salvage"/>');
	content.append(button);
	this.mEIMO.Buttons.RatioSalvageButton = button.createImageButton(Path.GFX + EIMO.BUTTON_SALVAGE, function ()
	{
		self.mDataSource.EIMOratioSalvageButtonClicked();
	}, '', 3);

	button = $('<div class="l-button repair-brother"/>');
	content.append(button);
	this.mEIMO.Buttons.RepairBrotherButton = button.createImageButton(Path.GFX + EIMO.BUTTON_REPAIR_ONE_DISABLED, function ()
	{
		if (self.mEIMO.Buttons.RepairBrotherButton.Enabled) self.mDataSource.EIMOpaidRepairBrother();
	}, '', 3);
	this.mEIMO.Buttons.RepairBrotherButton.Enabled = false;

	button = $('<div class="l-button repair-company"/>');
	content.append(button);
	this.mEIMO.Buttons.RepairCompanyButton = button.createImageButton(Path.GFX + EIMO.BUTTON_REPAIR_ALL_DISABLED, function ()
	{
		if (self.mEIMO.Buttons.RepairCompanyButton.Enabled) self.mDataSource.EIMOpaidRepairCompany();
	}, '', 3);
	this.mEIMO.Buttons.RepairCompanyButton.Enabled = false;

	this.EIMOregisterDatasourceListener();
}

var destroyDiv = CharacterScreenRightPanelHeaderModule.prototype.destroyDIV;
CharacterScreenRightPanelHeaderModule.prototype.destroyDIV = function()
{
	this.mEIMO.Buttons.RatioRepairButton.remove();
	this.mEIMO.Buttons.RatioRepairButton = null;

	this.mEIMO.Buttons.RatioSalvageButton.remove();
	this.mEIMO.Buttons.RatioSalvageButton = null;

	this.mEIMO.Buttons.RepairBrotherButton.remove();
	this.mEIMO.Buttons.RepairBrotherButton = null;

	this.mEIMO.Buttons.RepairCompanyButton.remove();
	this.mEIMO.Buttons.RepairCompanyButton = null;

	this.mEIMO.Buttons.empty();
	this.mEIMO.Buttons.remove();
	this.mEIMO.Buttons = null;
	destroyDiv.call(this);
}

CharacterScreenRightPanelHeaderModule.prototype.EIMOregisterDatasourceListener = function()
{
	this.mDataSource.addListener(CharacterScreenDatasourceIdentifier.Brother.Selected, jQuery.proxy(this.EIMOonSelectBrother, this));
	this.mDataSource.addListener(CharacterScreenDatasourceIdentifier.Inventory.StashItemUpdated.Key, jQuery.proxy(this.EIMOupdateRepairButtons, this));
}

var csBindTooltips = CharacterScreenRightPanelHeaderModule.prototype.bindTooltips;
CharacterScreenRightPanelHeaderModule.prototype.bindTooltips = function ()
{
	csBindTooltips.call(this)

	this.mEIMO.Buttons.RatioRepairButton.bindTooltip({ contentType: 'msu-generic', modId: EIMO.ID,  elementId:  'CharacterScreen.RepairButton' });
	this.mEIMO.Buttons.RatioSalvageButton.bindTooltip({ contentType: 'msu-generic', modId: EIMO.ID, elementId: 'CharacterScreen.SalvageButton' });
	this.mEIMO.Buttons.RepairBrotherButton.bindTooltip({ contentType: 'msu-generic', modId: EIMO.ID, elementId:  'CharacterScreen.RepairBrotherButton' });
	this.mEIMO.Buttons.RepairCompanyButton.bindTooltip({ contentType: 'msu-generic', modId: EIMO.ID, elementId:  'CharacterScreen.RepairCompanyButton' });
}

var csUnbindTooltips = CharacterScreenRightPanelHeaderModule.prototype.unbindTooltips;
CharacterScreenRightPanelHeaderModule.prototype.unbindTooltips = function ()
{
	csUnbindTooltips.call(this);

	this.mEIMO.Buttons.RatioRepairButton.unbindTooltip();
	this.mEIMO.Buttons.RatioSalvageButton.unbindTooltip();
	this.mEIMO.Buttons.RepairBrotherButton.unbindTooltip();
	this.mEIMO.Buttons.RepairCompanyButton.unbindTooltip();
}

CharacterScreenRightPanelHeaderModule.prototype.EIMOhide = function()
{
	this.mEIMO.Buttons.removeClass('opacity-full is-top').addClass('opacity-none no-pointer-events');
}

CharacterScreenRightPanelHeaderModule.prototype.EIMOshow = function(_data)
{
	this.mEIMO.Legends = _data.EIMO.legends;
	this.mEIMO.CanRepair = _data.EIMO.canRepair;
	this.EIMOupdateRepairButtons();
	this.mEIMO.Buttons.removeClass('opacity-none no-pointer-events').addClass('opacity-full is-top');
}

CharacterScreenRightPanelHeaderModule.prototype.eimo_isVisible = function()
{
	return this.mEIMO.Buttons.hasClass('opacity-full');
}

CharacterScreenRightPanelHeaderModule.prototype.EIMOonSelectBrother = function(_datasource, _brother)
{
	this.mDataSource.EIMOsetSelectedBrother(_brother[CharacterScreenIdentifier.Entity.Id]);
	this.EIMOupdateRepairButtons();
}

CharacterScreenRightPanelHeaderModule.prototype.EIMOupdateRepairButtons = function()
{
	var self = this;
	if (this.mEIMO.CanRepair)
	{
		this.mDataSource.EIMOgetRepairData(function(data)
		{
			self.EIMOrepairBrotherButtonState(data.SelectedBrotherPrice != 0);
			self.EIMOrepairCompanyButtonState(data.CompanyPrice != 0);
		});
	}
	else
	{
		this.EIMOrepairBrotherButtonState(false);
		this.EIMOrepairCompanyButtonState(false);
	}
	if (this.mEIMO.Legends)
	{
		this.mEIMO.Buttons.RatioSalvageButton.removeClass('opacity-none no-pointer-events')
	}
	else
	{
		this.mEIMO.Buttons.RatioSalvageButton.addClass('opacity-none no-pointer-events')
	}
}

CharacterScreenRightPanelHeaderModule.prototype.EIMOrepairBrotherButtonState = function (_enable)
{
	if (!this.mEIMO.CanRepair) _enable = false;
	if (this.mEIMO.Buttons.RepairBrotherButton.Enabled === _enable) return;
	this.mEIMO.Buttons.RepairBrotherButton.Enabled = _enable;
	if (_enable === true)
		this.mEIMO.Buttons.RepairBrotherButton.changeButtonImage(Path.GFX + EIMO.BUTTON_REPAIR_ONE_ENABLED);
	else
		this.mEIMO.Buttons.RepairBrotherButton.changeButtonImage(Path.GFX + EIMO.BUTTON_REPAIR_ONE_DISABLED);
};

CharacterScreenRightPanelHeaderModule.prototype.EIMOrepairCompanyButtonState = function (_enable)
{
	if (!this.mEIMO.CanRepair) _enable = false;
	if (this.mEIMO.Buttons.RepairCompanyButton.Enabled === _enable) return;
	this.mEIMO.Buttons.RepairCompanyButton.Enabled = _enable;
	if (_enable === true)
		this.mEIMO.Buttons.RepairCompanyButton.changeButtonImage(Path.GFX + EIMO.BUTTON_REPAIR_ALL_ENABLED);
	else
		this.mEIMO.Buttons.RepairCompanyButton.changeButtonImage(Path.GFX + EIMO.BUTTON_REPAIR_ALL_DISABLED);
};

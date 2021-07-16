{
	var createDiv = CharacterScreenRightPanelHeaderModule.prototype.createDIV;
	CharacterScreenRightPanelHeaderModule.prototype.createDIV = function (_parentDiv)
	{

		createDiv.call(this, _parentDiv);
		var self = this;

		this.mEIMO = 
		{
			SettingsValues: 
			{
				repairThreshold: 
				{
					Control: null,
					Title: null,
					Key: "repair-threshold",
					Min: 100,
					Max: 500,
					Value: 200,
					Step: 10				
				},
				waitThreshold: 
				{
					Control: null,
					Title: null,
					Key: "wait-threshold",
					Min: 100,
					Max: 500,
					Value: 250,
					Step: 10
				}
			},
			SettingsButton: null,
			OptionsMenu:
			{
				DrepairButton: null,
				ChangeVisibilityButton: null,
				RepairBrother:
				{
					Enabled: false
				},
				RepairCompany:
				{
					Enabled: false
				}
			},
			CurrentBrother: null,
			CanRepair: false
		};

		var layout = $('<div class="l-button EIMO-settings-button"/>');
		var rightButtonContainer = this.mContainer.find(".is-right:first");
		rightButtonContainer.append(layout)
		this.mEIMO.SettingsButton = layout.createImageButton(Path.GFX + EIMO.BUTTON_SETTINGS, function ()
		{
			if (self.mEIMO.OptionsMenu.hasClass('opacity-full'))
			{
				self.EIMOhide();
				self.EIMOsetSettings();
				self.EIMOsetVisible();
			}
			else
			{
				self.EIMOshow();
				self.EIMOsetVisible();
				self.EIMOgetSettings();
			}
		}, '', 6);

		this.mEIMO.OptionsMenu = $('<div class="EIMO-settings"/>');
		this.mContainer.append(this.mEIMO.OptionsMenu);

		var settingsImage = $('<div class="background"/>');
		this.mEIMO.OptionsMenu.append(settingsImage);

		this.createSliderControlDIV(this.mEIMO.SettingsValues.repairThreshold, "Repair Ratio", this.mEIMO.OptionsMenu);
		this.createSliderControlDIV(this.mEIMO.SettingsValues.waitThreshold, "Wait Until Repaired Ratio", this.mEIMO.OptionsMenu);

		var content = $('<div class="row"/>');
		this.mEIMO.OptionsMenu.append(content);
		var layout = $('<div class="l-button repair"/>');
		content.append(layout);
		this.mEIMO.OptionsMenu.DrepairButton = layout.createImageButton(Path.GFX + EIMO.BUTTON_REPAIR, function ()
		{
			self.mDataSource.EIMOrepairAllButtonClicked();
		}, '', 3);

		var layout = $('<div class="l-button visibility-level"/>');
		content.append(layout);
		this.mEIMO.OptionsMenu.ChangeVisibilityButton = layout.createImageButton(Path.GFX + EIMO.BUTTON_VISIBILITY, function ()
		{
			self.mDataSource.ChangeVisibilityButtonClicked();
		}, '', 3);

		var layout = $('<div class="l-button repair-brother"/>');
		content.append(layout);
		this.mEIMO.OptionsMenu.RepairBrother = layout.createImageButton(Path.GFX + EIMO.BUTTON_REPAIR_ONE_DISABLED, function ()
		{
			if(self.mEIMO.OptionsMenu.RepairBrother.Enabled) self.mDataSource.EIMOpaidRepairBrother();
		}, '', 3);
		this.mEIMO.OptionsMenu.RepairBrother.Enabled = false

		var layout = $('<div class="l-button repair-company"/>');
		content.append(layout);
		this.mEIMO.OptionsMenu.RepairCompany = layout.createImageButton(Path.GFX + EIMO.BUTTON_REPAIR_ALL_DISABLED, function ()
		{
			if(self.mEIMO.OptionsMenu.RepairCompany.Enabled) self.mDataSource.EIMOpaidRepairCompany();
		}, '', 3);
		this.mEIMO.OptionsMenu.RepairCompany.Enabled = false;

		if (this.mDataSource.isTacticalMode()) 
		{
			this.EIMOhide();
			this.mEIMO.SettingsButton.removeClass('opacity-full is-top').addClass('opacity-none no-pointer-events');
		}
		else
		{
			this.EIMOregisterDatasourceListener();
		}
	}

	CharacterScreenRightPanelHeaderModule.prototype.createSliderControlDIV = function (_definition, _label, _parentDiv)
	{
		var self = this;
		var row = $('<div class="row ' + _definition.Key + '"></div>');
		_parentDiv.append(row);

		_definition.Title = $('<div class="title title-font-big font-bold font-color-title">' + _label + '</div>');
		row.append(_definition.Title);

		var control = $('<div class="control"></div>');
		row.append(control);

		_definition.Control = $('<input class="scale-slider" type="range"/>');
		_definition.Control.attr('min', _definition.Min);
		_definition.Control.attr('max', _definition.Max);
		_definition.Control.attr('step', _definition.Step);
		_definition.Control.val(_definition.Value);
		control.append(_definition.Control);

		_definition.Label = $('<div class="scale-label text-font-normal font-color-subtitle">' +_definition.Value + '</div>');
		control.append(_definition.Label);

		_definition.Control.update = function(_num)
		{
			if (_num !== null) _definition.Control.val(_num)

			_definition.Value = parseInt(_definition.Control.val())
			_definition.Label.text(_definition.Value + '%')
		}

		_definition.Control.on("change", function ()
		{
			_definition.Control.update(null);
			self.EIMOsetSettings()
		});
	};

	var destroyDiv = CharacterScreenRightPanelHeaderModule.prototype.destroyDIV;
	CharacterScreenRightPanelHeaderModule.prototype.destroyDIV = function()
	{
		destroyDiv.call(this);

		this.mEIMO.SettingsButton.remove();
		this.mEIMO.SettingsButton = null;

		this.mEIMO.OptionsMenu.DrepairButton.remove();
		this.mEIMO.OptionsMenu.DrepairButton = null;

		this.mEIMO.OptionsMenu.ChangeVisibilityButton.remove();
		this.mEIMO.OptionsMenu.ChangeVisibilityButton = null;

		this.mEIMO.OptionsMenu.RepairBrother.remove();
		this.mEIMO.OptionsMenu.RepairBrother = null;

		this.mEIMO.OptionsMenu.RepairCompany.remove();
		this.mEIMO.OptionsMenu.RepairCompany = null;

		this.mEIMO.SettingsValues.repairThreshold.Control.empty();
		this.mEIMO.SettingsValues.repairThreshold.Control.remove();
		this.mEIMO.SettingsValues.repairThreshold.Control = null;

		this.mEIMO.SettingsValues.waitThreshold.Control.empty();
		this.mEIMO.SettingsValues.waitThreshold.Control.remove();
		this.mEIMO.SettingsValues.waitThreshold.Control = null;

		this.mEIMO.OptionsMenu.empty();
		this.mEIMO.OptionsMenu.remove();
		this.mEIMO.OptionsMenu = null;
	}

	CharacterScreenRightPanelHeaderModule.prototype.EIMOregisterDatasourceListener = function()
	{
		this.mDataSource.addListener(CharacterScreenDatasourceIdentifier.Brother.ListLoaded, jQuery.proxy(this.EIMOgetSettings, this));
		this.mDataSource.addListener(CharacterScreenDatasourceIdentifier.Brother.Selected, jQuery.proxy(this.EIMOonSelectBrother, this));
		this.mDataSource.addListener(CharacterScreenDatasourceIdentifier.Inventory.StashItemUpdated.Key, jQuery.proxy(this.EIMOupdateRepairButton, this));
	}

	var csBindTooltips = CharacterScreenRightPanelHeaderModule.prototype.bindTooltips;
	CharacterScreenRightPanelHeaderModule.prototype.bindTooltips = function ()
	{
		csBindTooltips.call(this)

		this.mEIMO.SettingsButton.bindTooltip({ contentType: 'ui-element', elementId: 'EIMO.SettingsButton' });

		this.mEIMO.OptionsMenu.DrepairButton.bindTooltip({ contentType: 'ui-element', elementId:  'EIMO.RepairButton' });
		this.mEIMO.OptionsMenu.ChangeVisibilityButton.bindTooltip({ contentType: 'ui-element', elementId:  'EIMO.ChangeVisibilityButton' });
		this.mEIMO.OptionsMenu.RepairBrother.bindTooltip({ contentType: 'ui-element', elementId:  'EIMO.RepairBrotherButton' });
		this.mEIMO.OptionsMenu.RepairCompany.bindTooltip({ contentType: 'ui-element', elementId:  'EIMO.RepairCompanyButton' });

		this.mEIMO.SettingsValues.repairThreshold.Control.bindTooltip({ contentType: 'ui-element', elementId:  'EIMO.RepairThresholdSlider' });
		this.mEIMO.SettingsValues.repairThreshold.Title.bindTooltip({ contentType: 'ui-element', elementId:  'EIMO.RepairThresholdSlider' });

		this.mEIMO.SettingsValues.waitThreshold.Control.bindTooltip({ contentType: 'ui-element', elementId:  'EIMO.WaitThresholdSlider' });
		this.mEIMO.SettingsValues.waitThreshold.Title.bindTooltip({ contentType: 'ui-element', elementId:  'EIMO.WaitThresholdSlider' });
	}

	var csUnbindTooltips = CharacterScreenRightPanelHeaderModule.prototype.unbindTooltips;
	CharacterScreenRightPanelHeaderModule.prototype.unbindTooltips = function ()
	{
		csUnbindTooltips.call(this);

		this.mEIMO.SettingsButton.unbindTooltip()

		this.mEIMO.OptionsMenu.DrepairButton.unbindTooltip();
		this.mEIMO.OptionsMenu.ChangeVisibilityButton.unbindTooltip();
		this.mEIMO.OptionsMenu.RepairBrother.unbindTooltip();
		this.mEIMO.OptionsMenu.RepairCompany.unbindTooltip();

		this.mEIMO.SettingsValues.repairThreshold.Control.unbindTooltip();
		this.mEIMO.SettingsValues.repairThreshold.Title.unbindTooltip();

		this.mEIMO.SettingsValues.waitThreshold.Control.unbindTooltip();
		this.mEIMO.SettingsValues.waitThreshold.Title.unbindTooltip();
	}

	CharacterScreenRightPanelHeaderModule.prototype.EIMOhide = function()
	{
		this.mEIMO.OptionsMenu.removeClass('opacity-full is-top').addClass('opacity-none no-pointer-events');
	}

	CharacterScreenRightPanelHeaderModule.prototype.EIMOshow = function()
	{
		this.mEIMO.OptionsMenu.removeClass('opacity-none no-pointer-events').addClass('opacity-full is-top');
	}

	CharacterScreenRightPanelHeaderModule.prototype.EIMOisVisible = function()
	{
		return this.mEIMO.OptionsMenu.hasClass('opacity-full');
	}

	CharacterScreenRightPanelHeaderModule.prototype.EIMOonSelectBrother = function(_datasource, _brother)
	{
		this.mDataSource.EIMOsetSelectedBrother(_brother[CharacterScreenIdentifier.Entity.Id]);
		this.EIMOupdateRepairButton();
	}

	CharacterScreenRightPanelHeaderModule.prototype.EIMOupdateRepairButton = function()
	{
		var self = this;
		this.mDataSource.EIMOgetRepairButtonData(function(data)
		{
			self.EIMORepairBrotherButtonState(data.canRepairBrother);
			self.EIMORepairCompanyButtonState(data.canRepairCompany);
		});
	}

	CharacterScreenRightPanelHeaderModule.prototype.EIMORepairBrotherButtonState = function (_enable)
	{
		if(!this.mEIMO.CanRepair) _enable = false;
		if(this.mEIMO.OptionsMenu.RepairBrother.Enabled === _enable) return;
		this.mEIMO.OptionsMenu.RepairBrother.Enabled = _enable;
		if (_enable === true)
			this.mEIMO.OptionsMenu.RepairBrother.changeButtonImage(Path.GFX + EIMO.BUTTON_REPAIR_ONE_ENABLED);
		else
			this.mEIMO.OptionsMenu.RepairBrother.changeButtonImage(Path.GFX + EIMO.BUTTON_REPAIR_ONE_DISABLED);
	};

	CharacterScreenRightPanelHeaderModule.prototype.EIMORepairCompanyButtonState = function (_enable)
	{
		if(!this.mEIMO.CanRepair) _enable = false;
		if(this.mEIMO.OptionsMenu.RepairCompany.Enabled === _enable) return;
		this.mEIMO.OptionsMenu.RepairCompany.Enabled = _enable;
		if (_enable === true)
			this.mEIMO.OptionsMenu.RepairCompany.changeButtonImage(Path.GFX + EIMO.BUTTON_REPAIR_ALL_ENABLED);
		else
			this.mEIMO.OptionsMenu.RepairCompany.changeButtonImage(Path.GFX + EIMO.BUTTON_REPAIR_ALL_DISABLED);
	};

	CharacterScreenRightPanelHeaderModule.prototype.EIMOgetSettings = function()
	{
		var self = this;
		this.mDataSource.notifyBackendEIMOgetSettings(function(res)
		{
			self.mEIMO.SettingsValues.repairThreshold.Value = res.repairThreshold;
			self.mEIMO.SettingsValues.waitThreshold.Value = res.waitThreshold;
			self.mEIMO.SettingsValues.repairThreshold.Control.update(res.repairThreshold);
			self.mEIMO.SettingsValues.waitThreshold.Control.update(res.waitThreshold);

			if(res.isVisible) self.EIMOshow();
			else self.EIMOhide();

			self.mEIMO.CanRepair = res.canRepair;
		});
	}

	CharacterScreenRightPanelHeaderModule.prototype.EIMOsetSettings = function()
	{
		var data = {
			"repairThreshold" : this.mEIMO.SettingsValues.repairThreshold.Value,
			"waitThreshold" : this.mEIMO.SettingsValues.waitThreshold.Value
		};
		this.mDataSource.notifyBackendEIMOsetSettings(data);
	}

	CharacterScreenRightPanelHeaderModule.prototype.EIMOsetVisible = function()
	{
		this.mDataSource.notifyBackendEIMOsetVisible(this.EIMOisVisible());
	}
}
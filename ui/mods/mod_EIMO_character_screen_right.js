{
	var createDiv = CharacterScreenRightPanelHeaderModule.prototype.createDIV;
	CharacterScreenRightPanelHeaderModule.prototype.createDIV = function (_parentDiv)
	{

		createDiv.call(this, _parentDiv);
		var self = this;

		this.mEIMO = {};

		this.mEIMO.SettingsValues = {
			repairThreshold : {
				Control : null,
				Title : null,
				Key: "repair-threshold",
				Min: 100,
				Max: 500,
				Value: 200,
				Step: 10				
			},
			waitThreshold : {
				Control : null,
				Title : null,
				Key: "wait-threshold",
				Min: 100,
				Max: 500,
				Value: 250,
				Step: 10
			}
		};

		var layout = $('<div class="l-button EIMO-settings-button"/>');
		var rightButtonContainer = this.mContainer.find(".is-right:first");
		rightButtonContainer.append(layout)
		this.mEIMO.SettingsButton = layout.createImageButton(Path.GFX + "ui/icons/EIMO_cog_button.png", function ()
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
		var layout = $('<div class="l-button EIMO-repair"/>');
		content.append(layout);
		this.mEIMO.DrepairButton = layout.createImageButton(Path.GFX + "ui/icons/EIMO_repair_button.png", function ()
		{
			self.mDataSource.EIMOrepairAllButtonClicked();
		}, '', 3);

		var layout = $('<div class="l-button EIMO-visibility-level"/>');
		content.append(layout);
		this.mEIMO.ChangeVisibilityButton = layout.createImageButton(Path.GFX + "ui/icons/EIMO_cycle_button.png", function ()
		{
			self.mDataSource.EIMOchangeVisibilityButtonClicked();
		}, '', 3);

		var layout = $('<div class="l-button salvage-button"/>');
		content.append(layout);
		this.mEIMO.SalvageButton = layout.createImageButton(Path.GFX + "ui/icons/EIMO_salvage_button.png", function ()
		{
			self.mDataSource.EIMOsalvageAllButtonClicked();
		}, '', 3);

		this.EIMOregisterDatasourceListener();
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

		this.mEIMO.OptionsMenu.empty();
		this.mEIMO.OptionsMenu.remove();
		this.mEIMO.OptionsMenu = null;

		this.mEIMO.SettingsButton.remove();
		this.mEIMO.SettingsButton = null;

		this.mEIMO.DrepairButton.remove();
		this.mEIMO.DrepairButton = null;

		this.mEIMO.ChangeVisibilityButton.remove();
		this.mEIMO.ChangeVisibilityButton = null;

		this.mEIMO.SettingsValues.repairThreshold.Control.empty();
		this.mEIMO.SettingsValues.repairThreshold.Control.remove();
		this.mEIMO.SettingsValues.repairThreshold.Control = null;

		this.mEIMO.SettingsValues.waitThreshold.Control.empty();
		this.mEIMO.SettingsValues.waitThreshold.Control.remove();
		this.mEIMO.SettingsValues.waitThreshold.Control = null;
	}

	CharacterScreenRightPanelHeaderModule.prototype.EIMOregisterDatasourceListener = function()
	{
		this.mDataSource.addListener(CharacterScreenDatasourceIdentifier.Inventory.StashLoaded, jQuery.proxy(this.EIMOgetSettings, this));
	}

	var csBindTooltips = CharacterScreenRightPanelHeaderModule.prototype.bindTooltips;
	CharacterScreenRightPanelHeaderModule.prototype.bindTooltips = function ()
	{
		csBindTooltips.call(this)

		this.mEIMO.SettingsButton.bindTooltip({ contentType: 'ui-element', elementId: 'EIMO.SettingsButton' });
		this.mEIMO.DrepairButton.bindTooltip({ contentType: 'ui-element', elementId:  'EIMO.RepairButton' });
		this.mEIMO.ChangeVisibilityButton.bindTooltip({ contentType: 'ui-element', elementId:  'EIMO.ChangeVisibilityButton' });
		this.mEIMO.SalvageButton.bindTooltip({contentType: 'ui-element', elementId:  'EIMO.SalvageAllButton'});

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
		this.mDrepairButton.unbindTooltip();
		this.mChangeVisibilityButton.unbindTooltip();
		this.mEIMO.SalvageButton.unbindTooltip();

		this.mEIMO.SettingsValues.repairThreshold.Control.unbindTooltip()
		this.mEIMO.SettingsValues.repairThreshold.Title.unbindTooltip()

		this.mEIMO.SettingsValues.waitThreshold.Control.unbindTooltip()
		this.mEIMO.SettingsValues.waitThreshold.Title.unbindTooltip()
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

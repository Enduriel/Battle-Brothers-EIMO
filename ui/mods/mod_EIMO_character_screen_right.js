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

		this.mEIMO.OptionsMenu = $('<div class="opacity-none EIMO-settings"/>');
		this.mContainer.append(this.mEIMO.OptionsMenu);

		var settingsImage = $('<div class="background"/>');
		this.mEIMO.OptionsMenu.append(settingsImage);

		var content = $('<div class="row"/>');
		this.mEIMO.OptionsMenu.append(content);
		this.createSliderControlDIV(this.mEIMO.SettingsValues.repairThreshold, "Repair Ratio", content);

		var content = $('<div class="row"/>');
		this.mEIMO.OptionsMenu.append(content);
		this.createSliderControlDIV(this.mEIMO.SettingsValues.waitThreshold, "Wait Until Repaired Ratio", content);

		var layout = $('<div class="l-button EIMO-settings-button"/>');
		var rightButtonContainer = this.mContainer.find(".is-right:first")
		rightButtonContainer.append(layout);

		this.mEIMO.SettingsButton = layout.createImageButton(Path.GFX + Asset.BUTTON_QUIT, function ()
		{
			if (self.mEIMO.OptionsMenu.hasClass('opacity-full'))
			{
				self.mEIMO.OptionsMenu.removeClass('opacity-full is-top').addClass('opacity-none no-pointer-events');
			}
			else
			{
				self.EIMOgetSettings();
				self.mEIMO.OptionsMenu.removeClass('opacity-none no-pointer-events').addClass('opacity-full is-top');
			}

		}, '', 6);
	}

	CharacterScreenRightPanelHeaderModule.prototype.createSliderControlDIV = function (_definition, _label, _parentDiv)
	{
		var self = this;
	
		var control = $('<div class="' + _definition.Key + '"></div>');
		_parentDiv.append(control);

		_definition.Title = $('<div class="title title-font-big font-bold font-color-title">' + _label + '</div>');
		control.append(_definition.Title);

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
			_definition.Label.text('' + _definition.Value)
		}

		_definition.Control.on("change", function ()
		{
			_definition.Control.update(null);
			self.EIMOsetSettings()
		});
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
		});
	}

	CharacterScreenRightPanelHeaderModule.prototype.EIMOsetSettings = function()
	{
		var self = this;
		var data = {
			"repairThreshold" : this.mEIMO.SettingsValues.repairThreshold.Value,
			"waitThreshold" : this.mEIMO.SettingsValues.waitThreshold.Value
		};
		this.mDataSource.notifyBackendEIMOsetSettings(data);
	}
}
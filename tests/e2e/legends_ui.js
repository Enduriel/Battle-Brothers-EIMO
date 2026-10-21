// UI half of legends_logic.nut (menu mode, Legends 19.4.22): checks EIMO's character screen buttons and the repair
// profit layer with Legends' replacement UI files loaded. The character screen is registered in the menu but has no
// script side, so SQ.call is intercepted to see what the buttons would send. ES5 only.
// Passing run: "header module" has EIMO buttons; clicking repair/salvage records eimo_onRatioRepairButtonClicked /
// eimo_onRatioSalvageButtonClicked; "profit layer" is display-block with label 42.
ClaudeProbe.run = function ()
{
	var report = function (_key, _fn)
	{
		var v;
		try { v = _fn(); } catch (e) { v = 'ERROR: ' + e; }
		ClaudeProbe.send(_key, '' + v);
	};

	report('screen', function () { return typeof Screens.WorldCharacterScreen; });
	report('header module', function ()
	{
		var hm = Screens.WorldCharacterScreen.mRightPanelModule.mHeaderModule;
		return 'mEIMO ' + (hm.mEIMO !== undefined) + ', container ' + $('.EIMO-character-screen-buttons').length
			+ ', repair ' + $('.EIMO-character-screen-buttons .l-button.repair > .ui-control').length
			+ ', salvage ' + $('.EIMO-character-screen-buttons .l-button.salvage > .ui-control').length;
	});

	var calls = [];
	var originalCall = SQ.call;
	SQ.call = function (_handle, _name)
	{
		calls.push(_name);
		if (_name.indexOf('eimo_') !== 0)
			return originalCall.apply(SQ, arguments);
	};
	report('click repair', function ()
	{
		$('.EIMO-character-screen-buttons .l-button.repair > .ui-control').click();
		return calls.join(',');
	});
	calls = [];
	report('click salvage', function ()
	{
		$('.EIMO-character-screen-buttons .l-button.salvage > .ui-control').click();
		return calls.join(',');
	});
	SQ.call = originalCall;

	report('profit layer', function ()
	{
		// MSU's settings never reach the UI in a probe run with Legends, so stub the visibility setting
		var getSettingValue = MSU.getSettingValue;
		MSU.getSettingValue = function () { return 'Full'; };
		var parent = $('<div/>');
		$('body').append(parent);
		var slot = parent.createListItem(true);
		slot.data('eimo', { forSale: false, favorite: false, idFavorite: false, repairProfit: 0 });
		EIMO.Generic.updateSlotItem(slot, { eimo_forSale: false, eimo_favorite: false, eimo_idFavorite: false, eimo_repairProfit: 42, amountColor: '#ffffff' });
		var layer = slot.find('.repair-profit-layer');
		var ret = 'layers ' + layer.length + ', class "' + layer.attr('class') + '", label "' + layer.find('.label').text() + '"';
		MSU.getSettingValue = getSettingValue;
		parent.remove();
		return ret;
	});
	ClaudeProbe.done();
};

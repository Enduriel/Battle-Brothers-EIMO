// UI half of legends_live.nut: in the open character screen, reads each stash slot's EIMO repair profit and Legends
// repair/salvage icon, clicks EIMO's ratio repair button, reads again, clicks the salvage button, reads again. ES5 only.
ClaudeProbe.run = function ()
{
	var slots = function ()
	{
		var ret = [];
		$('.ui-control.item').each(function ()
		{
			var data = $(this).data('item');
			if (!data || data.isEmpty || data.itemId === undefined || data.itemId === null)
				return;
			var profit = $(this).find('> .repair-profit-layer');
			var icon = $(this).find('> .repair-layer');
			var profitText = profit.hasClass('display-block') ? profit.find('.label').text() : '-';
			var iconText = icon.hasClass('display-block') ? (icon.find('img').attr('src').indexOf('salvage') >= 0 ? 'salvage' : 'repair') : '-';
			if (profitText !== '-' || iconText !== '-')
				ret.push(data.itemId + ': profit ' + profitText + ', icon ' + iconText);
		});
		return ret.length + ' slots: ' + ret.join('; ');
	};
	var click = function (_cls)
	{
		var button = $('.EIMO-character-screen-buttons .l-button.' + _cls + ' > .ui-control');
		ClaudeProbe.send('click ' + _cls, 'buttons found ' + button.length + ', container visible ' + $('.EIMO-character-screen-buttons').hasClass('opacity-full'));
		button.click();
	};

	setTimeout(function ()
	{
		ClaudeProbe.send('slots before', slots());
		click('repair');
	}, 6000);
	setTimeout(function ()
	{
		ClaudeProbe.send('slots after repair', slots());
		click('salvage');
	}, 11000);
	setTimeout(function ()
	{
		ClaudeProbe.send('slots after salvage', slots());
	}, 16000);
	setTimeout(function ()
	{
		ClaudeProbe.done();
	}, 17000);
};

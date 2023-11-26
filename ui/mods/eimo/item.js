EIMO.Hooks.$_createListItem = $.fn.createListItem;
$.fn.createListItem = function(_withPriceLayer, _backgroundImage, _classes)
{
	var result = EIMO.Hooks.$_createListItem.call(this, _withPriceLayer, _backgroundImage, _classes);

	// Repair profit layer
	var repairProfitLayer = $('<div class="repair-profit-layer display-none"/>');
	result.append(repairProfitLayer);
	var repairProfitImage = $('<img/>');
	repairProfitImage.attr('src', Path.GFX + Asset.ICON_ASSET_MONEY);
	repairProfitLayer.append(repairProfitImage);
	var repairProfitLabel = $('<div class="label text-font-very-small font-color-value font-shadow-outline"/>');
	repairProfitLayer.append(repairProfitLabel);

	// For sale layer
	var forSaleLayer = $('<div class="for-sale-layer display-none"/>');
	result.append(forSaleLayer);
	var forSaleImage = $('<img/>');
	forSaleImage.attr('src', Path.GFX + EIMO.ICON_MONEY);
	forSaleLayer.append(forSaleImage);

	// Favorite layer
	var favoriteLayer = $('<div class="favorite-layer display-none"/>');
	result.append(favoriteLayer);
	var favoriteImage = $('<img/>');
	favoriteImage.attr('src', Path.GFX + EIMO.ICON_FAVORITE);
	favoriteLayer.append(favoriteImage);

	return result;
};

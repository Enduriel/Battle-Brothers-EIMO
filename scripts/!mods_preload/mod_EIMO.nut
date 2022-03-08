::EIMO <- {};

::EIMO.ID <- "mod_eimo";
::EIMO.Name <- "End's Inventory Management Overhaul";
::EIMO.Version <- "1.10.0-alpha";

::mods_registerMod(this.EIMO.ID, 10, this.EIMO.Name);
::mods_queue(null, "mod_MSU, >mod_smartLoot", function()
{
	this.MSU.registerMod(this.EIMO.ID, this.EIMO.Version, this.EIMO.Name);

	gt.Const.EIMO.ShowSettings <- true;
});

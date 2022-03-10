::EIMO <- {};

::EIMO.ID <- "mod_EIMO";
::EIMO.Name <- "End's Inventory Management Overhaul";
::EIMO.Version <- "2.0.0-alpha";

::mods_registerMod(this.EIMO.ID, 10, this.EIMO.Name);
::mods_queue(null, "mod_MSU, !mod_smartLoot", function()
{
	this.MSU.registerMod(this.EIMO.ID, this.EIMO.Version, this.EIMO.Name);
	this.include("eimo/load.nut");
});

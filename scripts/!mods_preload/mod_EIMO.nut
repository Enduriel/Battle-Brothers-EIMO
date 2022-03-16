::EIMO <- {};

::EIMO.ID <- "mod_EIMO";
::EIMO.Name <- "End's Inventory Management Overhaul";
::EIMO.Version <- "2.0.0-alpha";

::mods_registerMod(this.EIMO.ID, 10, this.EIMO.Name);
::mods_queue(null, "mod_MSU, !mod_smartLoot, >mod_legends", function()
{
	::EIMO.Mod <- ::MSU.Class.Mod(::EIMO.ID, ::EIMO.Version, ::EIMO.Name)
	this.include("eimo/load.nut");
});

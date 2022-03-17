::EIMO <- {};

::EIMO.ID <- "mod_EIMO";
::EIMO.Name <- "End's Inventory Management Overhaul";
::EIMO.Version <- "2.0.0-alpha";

::isDevmode <- function()
{
	return true;
}


::mods_registerMod(::EIMO.ID, 10, ::EIMO.Name);
::mods_queue(null, "mod_MSU, !mod_smartLoot, >mod_legends", function()
{
	::EIMO.Mod <- ::MSU.Class.Mod(::EIMO.ID, ::EIMO.Version, ::EIMO.Name)
	this.include("eimo/load.nut");
});

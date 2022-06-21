::EIMO <- {};

::EIMO.ID <- "mod_EIMO";
::EIMO.Name <- "End's Inventory Management Overhaul";
::EIMO.Version <- "9.0.4";

::mods_registerMod(::EIMO.ID, ::EIMO.Version, ::EIMO.Name);
::mods_queue(null, "mod_msu(>=1.1.0), !mod_smartLoot, >mod_legends", function()
{
	::EIMO.Mod <- ::MSU.Class.Mod(::EIMO.ID, ::EIMO.Version, ::EIMO.Name)
	::include("eimo/load.nut");
});

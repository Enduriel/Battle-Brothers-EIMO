::EIMO <- {};

::EIMO.ID <- "mod_EIMO";
::EIMO.Name <- "End's Inventory Management Overhaul";
::EIMO.Version <- "2.0.0-beta";

::mods_registerMod(::EIMO.ID, ::EIMO.Version, ::EIMO.Name);
::mods_queue(null, "mod_msu(>=1.0.0-beta), !mod_smartLoot, >mod_legends", function()
{
	::EIMO.Mod <- ::MSU.Class.Mod(::EIMO.ID, ::EIMO.Version, ::EIMO.Name)
	::include("eimo/load.nut");
});

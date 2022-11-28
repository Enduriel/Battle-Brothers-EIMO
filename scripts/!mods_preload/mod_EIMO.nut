::EIMO <- {
	ID = "mod_EIMO",
	Name = "End's Inventory Management Overhaul",
	Version = "9.1.0",
	FavoriteIDs = {},
	ForSaleIDs = {}
};


::mods_registerMod(::EIMO.ID, ::EIMO.Version, ::EIMO.Name);
::mods_queue(null, "mod_msu(>=1.1.0), !mod_smartLoot, >mod_legends", function() //TODO, update MSU dependency to 1.2
{
	::EIMO.Mod <- ::MSU.Class.Mod(::EIMO.ID, ::EIMO.Version, ::EIMO.Name)
	::include("eimo/load.nut");
});

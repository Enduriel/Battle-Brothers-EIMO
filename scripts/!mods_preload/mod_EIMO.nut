::EIMO <- {
	ID = "mod_EIMO",
	Name = "End's Inventory Management Overhaul",
	Version = "9.1.1",
	FavoriteIDs = {},
	ForSaleIDs = {}
};


::mods_registerMod(::EIMO.ID, ::EIMO.Version, ::EIMO.Name);
::mods_queue(null, "mod_msu(>=1.2.0), !mod_smartLoot, >mod_legends", function()
{
	::EIMO.Mod <- ::MSU.Class.Mod(::EIMO.ID, ::EIMO.Version, ::EIMO.Name)
	::include("eimo/load.nut");
});

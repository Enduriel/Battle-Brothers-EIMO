::EIMO <- {
	ID = "mod_EIMO",
	Name = "End's Inventory Management Overhaul",
	Version = "10.0.1",
	FavoriteIDs = {},
	ForSaleIDs = {}
};

::EIMO.HookMod <- ::Hooks.register(::EIMO.ID, ::EIMO.Version, ::EIMO.Name);
::EIMO.HookMod.require("mod_msu > 1.2.0");
::EIMO.HookMod.conflictWith("mod_smartLoot");

::EIMO.HookMod.queue(">mod_msu", ">mod_legends", function() {
	::EIMO.Mod <- ::MSU.Class.Mod(::EIMO.ID, ::EIMO.Version, ::EIMO.Name)
	::include("eimo/load.nut");
})

::EIMO.HookMod.queue(">mod_msu", function(){
	::EIMO.JSConnection <- ::new("scripts/ui/mods/eimo_js_connection");
	::MSU.UI.registerConnection(::EIMO.JSConnection);
}, ::Hooks.QueueBucket.AfterHooks);

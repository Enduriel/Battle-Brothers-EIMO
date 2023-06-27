::include("eimo/msu");
::include("eimo/global_functions");
foreach (file in ::IO.enumerateFiles("eimo/hooks"))
	::include(file);
foreach (file in ::IO.enumerateFiles("eimo/ui"))
	::include(file)

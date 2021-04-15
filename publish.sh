rm -rvf CatalogKO/out
rm -rvf CatalogAPI/out

dotnet publish Catalog.KO/ -c Release -o Catalog.KO/out 
dotnet publish Catalog.API -c Release -o Catalog.API/out
cp Catalog.API/local.settings.json Catalog.API/out/
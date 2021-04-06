dotnet publish Catalog.KO/ -c Release -o Catalog.KO/out 

dotnet publish Catalog.API -c Release -o Catalog.API/out
cp Catalog.API/local.settings.json Catalog.API/out/

docker build -t catalogapi Catalog.API/
docker build -t catalogko Catalog.KO/
docker run -d -p 1234:80 --name CatalogKO catalogko
docker run -d -p 4321:80 --name CatalogAPI catalogapi
#remove and rebuild
rm -rvf dist/
rm -rvf ../nginx-proxy/CatalogNG

#Build with a path to /blog/
echo Building NG elements
ng build --prod --base-href /

#copy to the nginx folder
cp -rvf dist/CatalogNG/ ../nginx-proxy/CatalogNG/
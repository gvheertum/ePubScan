namespace Catalog.Models
{
    public class CatalogConfiguration
    {
        public string CatalogApiRootUrl { get; set; }
        public string CatalogApiRootUrlString { get { return "\"" + CatalogApiRootUrl + "\""; } }
    }
}
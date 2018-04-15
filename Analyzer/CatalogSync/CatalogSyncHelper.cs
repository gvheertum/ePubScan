using Microsoft.Extensions.Configuration;

namespace EpubAnalyzer.CatalogSync
{
	public class CatalogSyncHelper
	{
		public CatalogSyncHelper(string connectionString)
		{
			
		}
	}
	public class CatalogSyncDatabaseSettingsRetriever
	{
		public string GetConnectionString()
		{
			var location = GetRunLocation();
			IConfigurationRoot configuration = new ConfigurationBuilder()
				.SetBasePath(location)
				.AddJsonFile("connectionstrings.json")
				.Build();
			return configuration.GetConnectionString("DefaultConnection");
		}

		private string GetRunLocation()
		{
			var assemblyRan = new System.IO.FileInfo(System.Reflection.Assembly.GetExecutingAssembly().Location);
			System.Console.WriteLine($"Assembly: {assemblyRan.FullName}");
			var folder = assemblyRan.Directory;
			System.Console.WriteLine($"Folder: {folder.FullName}");
			return folder.FullName;
		}
	}
}
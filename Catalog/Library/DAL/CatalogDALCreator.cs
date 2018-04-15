using ePubAnalyzer.Shared.DAL;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.Json;
using System;
namespace Library.DAL
{
	public class CatalogDALCreator
	{
		public DALImplementation GetDALImplementation()
		{
			return new DALImplementation(GetConnectionStringFromConfig());
		}
	
		private string GetConnectionStringFromConfig()
		{
			IConfigurationRoot configuration = new ConfigurationBuilder()
				.AddJsonFile("connectionstrings.json")
				.Build();
			return configuration.GetConnectionString("DefaultConnection");
		}
	}
}
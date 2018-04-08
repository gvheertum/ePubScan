using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.Json;
using System;
namespace Library.DAL
{
	public class EpubCatalogContext : Microsoft.EntityFrameworkCore.DbContext
	{
		public EpubCatalogContext(DbContextOptions<EpubCatalogContext> options) : base(options)
        {
        }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
			modelBuilder.Entity<Models.Book>().ToTable("Book");
        }

        public DbSet<Models.Book> Books { get; set; }

		protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
		{
			IConfigurationRoot configuration = new ConfigurationBuilder()
				.SetBasePath("/Users/gertjan/Development/EpubAnalyzer/Catalog")
				.AddJsonFile("appsettings.json")
				.AddJsonFile("connectionstrings.json")
				.Build();
			optionsBuilder.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
		}

		public static DbContextOptions<EpubCatalogContext> GetConfig()
		{
			var optionsBuilder = new DbContextOptionsBuilder<EpubCatalogContext>();
			return optionsBuilder.Options;
		}
	}
}
using Microsoft.EntityFrameworkCore;
using System;
namespace ePubAnalyzer.Shared.DAL
{
	public class EpubCatalogContext : Microsoft.EntityFrameworkCore.DbContext
	{
		public EpubCatalogContext(DbContextOptions<EpubCatalogContext> options) : base(options)
        {
        }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
			modelBuilder.Entity<Entities.Book>().ToTable("Book");
        }

        public DbSet<Entities.Book> Books { get; set; }

		protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
		{
			// IConfigurationRoot configuration = new ConfigurationBuilder()
			// 	.SetBasePath("/Users/gertjan/Development/EpubAnalyzer/Catalog")
			// 	.AddJsonFile("appsettings.json")
			// 	.AddJsonFile("connectionstrings.json")
			// 	.Build();
			//optionsBuilder.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
			//optionsBuilder
			//return optionsBuilder;
		}

		public static DbContextOptions<EpubCatalogContext> GetConfig(string connectionString)
		{
			var optionsBuilder = new DbContextOptionsBuilder<EpubCatalogContext>();
			optionsBuilder.UseSqlServer(connectionString);
			return optionsBuilder.Options;
		}
	}
}
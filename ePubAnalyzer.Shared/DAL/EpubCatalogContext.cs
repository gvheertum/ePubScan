using Microsoft.EntityFrameworkCore;
using System;
namespace ePubAnalyzer.Shared.DAL
{
	public class EpubCatalogContext : Microsoft.EntityFrameworkCore.DbContext
	{
		private const string PostgresqlLookup = "Provider=Postgresql";

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
		}	
		public static DbContextOptions<EpubCatalogContext> GetConfig(string connectionString)
		{
			var optionsBuilder = new DbContextOptionsBuilder<EpubCatalogContext>();
			if(connectionString.Contains(PostgresqlLookup, StringComparison.InvariantCultureIgnoreCase)) 
			{
				connectionString = connectionString.Replace(PostgresqlLookup, "", StringComparison.OrdinalIgnoreCase); //remove postgres prefix
				connectionString = connectionString.StartsWith(";") ? connectionString.Substring(1) : connectionString; //remove leading ;
				optionsBuilder.UseNpgsql(connectionString);
			}
			else{
				optionsBuilder.UseSqlServer(connectionString);
			}
			return optionsBuilder.Options;
		}
	}
}
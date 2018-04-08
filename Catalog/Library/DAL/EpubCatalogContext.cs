using Microsoft.EntityFrameworkCore;

namespace Library.DAL
{
	public class EpubCatalogContext : Microsoft.EntityFrameworkCore.DbContext
	{
		public EpubCatalogContext(DbContextOptions<EpubCatalogContext> options) : base(options)
        {
        }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
			modelBuilder.Entity<Book>().ToTable("Book");
        }

        public DbSet<Models.Book> Books { get; set; }
	}
}
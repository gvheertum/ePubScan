using System.Linq;
using System.Collections.Generic;
using EpubAnalyzer.Entities;
using ePubAnalyzer.Shared.Entities;
using System.Threading.Tasks;

namespace ePubAnalyzer.ComparisonHelper
{
    public class DatabaseComparisonHelperLocal : DatabaseComparisonHelperBase
	{
		private readonly ePubAnalyzer.Shared.ComparisonHelper.DatabaseComparisonHelperLocal sharedLocalHelper;

		public DatabaseComparisonHelperLocal(string connectionString)
		{
			this.sharedLocalHelper = new ePubAnalyzer.Shared.ComparisonHelper.DatabaseComparisonHelperLocal(connectionString);
		}

		public override ComparisonContainer<Book> CompareSetWithDatabase(IEnumerable<EbookData> books)
		{
			var currBooksInSystem = sharedLocalHelper.GetExistingBooks();
			var booksToSave = books.Select(b=> b.BookDetail).ToList();
			return new Shared.Library.BookSetComparer().GetComparisonContainer(currBooksInSystem, booksToSave);
		}

		public override ComparisonContainer<Book> GetComparisonContainer(IEnumerable<Book> existingBooks, IEnumerable<Book> newBooks)
		{
			return sharedLocalHelper.GetComparisonContainer(existingBooks, newBooks);
		}

		public override void EchoComparisonSetDetails(ComparisonContainer<Book> container)
		{
			sharedLocalHelper.EchoComparisonSetDetails(container);
		}

		public override async Task SaveExistingItems(ComparisonContainer<Book> container)
		{
			await sharedLocalHelper.SaveExistingItems(container);
		}

		public override async Task SaveNewItems(ComparisonContainer<Book> container)
		{
			await sharedLocalHelper.SaveNewItems(container);
		}
	}
}

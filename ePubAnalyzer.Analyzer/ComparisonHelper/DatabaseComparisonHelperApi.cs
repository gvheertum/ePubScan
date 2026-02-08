using System.Linq;
using System.Collections.Generic;
using EpubAnalyzer.Entities;
using ePubAnalyzer.Shared.BLL;
using ePubAnalyzer.Shared.Entities;
using System.Threading.Tasks;

namespace ePubAnalyzer.ComparisonHelper
{
    public class DatabaseComparisonHelperApi : DatabaseComparisonHelperBase
	{
        private ePubAnalyzer.Shared.ComparisonHelper.DatabaseComparisonHelperApi sharedApiHelper;

        public DatabaseComparisonHelperApi(BookLogicApiHandler apiLogic)
		{
			this.sharedApiHelper = new ePubAnalyzer.Shared.ComparisonHelper.DatabaseComparisonHelperApi(apiLogic);
		}

		public override ComparisonContainer<Book> CompareSetWithDatabase(IEnumerable<EbookData> books)
		{
			var bData = books.Select(b => b.BookDetail);
			var currBooksInSystem = sharedApiHelper.GetExistingBooks().GetAwaiter().GetResult();
			var booksToSave = books.Select(b=> b.BookDetail).ToList();
			return new Shared.Library.BookSetComparer().GetComparisonContainer(currBooksInSystem, booksToSave);
		}

		public override ComparisonContainer<Book> GetComparisonContainer(IEnumerable<Book> existingBooks, IEnumerable<Book> newBooks)
		{
			return sharedApiHelper.GetComparisonContainer(existingBooks, newBooks);
		}

		public  override void EchoComparisonSetDetails(ComparisonContainer<Book> container)
		{
			sharedApiHelper.EchoComparisonSetDetails(container);
		}

		public  override async Task SaveExistingItems(ComparisonContainer<Book> container)
		{
			await sharedApiHelper.SaveExistingItems(container);
		}

		public  override async Task SaveNewItems(ComparisonContainer<Book> container)
		{
			await sharedApiHelper.SaveNewItems(container);
		}
	}
}

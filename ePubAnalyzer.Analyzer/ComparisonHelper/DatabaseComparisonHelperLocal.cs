using System.Linq;
using System.Collections.Generic;
using EpubAnalyzer.Entities;
using ePubAnalyzer.Shared.BLL;
using ePubAnalyzer.Shared.Entities;
using System.Threading.Tasks;

namespace ePubAnalyzer.ComparisonHelper
{
    public class DatabaseComparisonHelperLocal : DatabaseComparisonHelperBase
	{
		private readonly string connectionString;

		public DatabaseComparisonHelperLocal(string connectionString)
		{
			this.connectionString = connectionString;
		}

		public override ComparisonContainer<Book> CompareSetWithDatabase(IEnumerable<EbookData> books)
		{
			return null;
			// var bData = books.Select(b => b.BookDetail);
			// var currBooksInSystem = apiLogic.GetBooks().GetAwaiter().GetResult();
			// var booksToSave = books.Select(b=> b.BookDetail).ToList();
			// return new Shared.Library.BookSetComparer().GetComparisonContainer(currBooksInSystem, booksToSave);
		}

		public override void EchoComparisonSetDetails(ComparisonContainer<Book> container)
		{
			System.Console.WriteLine("Comparison results");
			System.Console.WriteLine($"** Found {container.NewItems.Count()} new books");
			foreach (var i in container.NewItems)
			{
				System.Console.WriteLine($"{i.Author} - {i.Title} (identifier: {i.Identifier})");
			}

			System.Console.WriteLine($"** Found {container.ExistingItems.Count()} existing books");
			foreach (var i in container.ExistingItems)
			{
				System.Console.WriteLine($"{i.Author} - {i.Title} (identifier: {i.Identifier}, id: {i.BookID})");
			}
		}

		public override async Task SaveExistingItems(ComparisonContainer<Book> container)
		{
			System.Console.WriteLine($"Saving {container.ExistingItems.Count()} existing books");
			foreach (var book in container.ExistingItems)
			{
				// var savedBook = await apiLogic.UpdateBook(book);
				// EchoWrittenBook(savedBook);
			}
		}

		public override async Task SaveNewItems(ComparisonContainer<Book> container)
		{
			System.Console.WriteLine($"Saving {container.NewItems.Count()} new books");
			foreach (var book in container.NewItems)
			{
				// var savedBook = await apiLogic.AddBook(book);
				// EchoWrittenBook(savedBook);
			}
		}

		private void EchoWrittenBook(Book book)
		{
			System.Console.WriteLine($"Wrote book: {book.Author} - {book.Title} (Identifier {book.Identifier}-> ID: {book.BookID}");
		}
	}
}

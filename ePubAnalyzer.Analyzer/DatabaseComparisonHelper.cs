using System.Linq;
using System.Collections.Generic;
using EpubAnalyzer.Entities;
using ePubAnalyzer.Shared.BLL;
using ePubAnalyzer.Shared.Entities;

namespace ePubAnalyzer
{
	public class DatabaseComparisonHelper
	{
		public ComparisonContainer<Book> CompareSetWithDatabase(IEnumerable<EbookData> books)
		{
			var bData = books.Select(b => b.BookDetail);
			var bookLogic = GetBookLogic();
			var comparisonResults = bookLogic.CompareBooksWithExistingCollection(bData.ToList());
			return comparisonResults;
		}

		public void EchoComparisonSetDetails(ComparisonContainer<Book> container)
		{
			System.Console.WriteLine("Comparison results");
			System.Console.WriteLine($"** Found {container.NewItems.Count()} new books");
			foreach(var i in container.NewItems)
			{
				System.Console.WriteLine($"{i.Author} - {i.Title} (identifier: {i.Identifier})");
			}
			
			System.Console.WriteLine($"** Found {container.ExistingItems.Count()} existing books");
			foreach(var i in container.ExistingItems)
			{
				System.Console.WriteLine($"{i.Author} - {i.Title} (identifier: {i.Identifier}, id: {i.BookID})");
			}
		}

		public void SaveExistingItems(ComparisonContainer<Book> container)
		{
			System.Console.WriteLine($"Saving {container.ExistingItems.Count()} existing books");
			foreach(var book in container.ExistingItems)
			{
				var savedBook = GetBookLogic().Save(book);
				EchoWrittenBook(savedBook);
			} 
		}

		public void SaveNewItems(ComparisonContainer<Book> container)
		{
			System.Console.WriteLine($"Saving {container.NewItems.Count()} new books");
			foreach(var book in container.NewItems)
			{
				var savedBook = GetBookLogic().Save(book);
				EchoWrittenBook(savedBook);
			} 
		}

		private void EchoWrittenBook(Book book)
		{
			System.Console.WriteLine($"Wrote book: {book.Author} - {book.Title} (Identifier {book.Identifier}-> ID: {book.BookID}");
		}

		private BookLogic GetBookLogic()
		{
			var cs = new EpubAnalyzer.CatalogSync.CatalogSyncDatabaseSettingsRetriever().GetConnectionString();
			var dal = new ePubAnalyzer.Shared.DAL.DALImplementation(cs);
			return new LogicFactory(dal).GetBookLogic();
		}
	}
}

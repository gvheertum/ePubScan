using System.Linq;
using System.Collections.Generic;
using ePubAnalyzer.Shared.BLL;
using ePubAnalyzer.Shared.DAL;
using ePubAnalyzer.Shared.Entities;
using System.Threading.Tasks;

namespace ePubAnalyzer.Shared.ComparisonHelper
{
    public class DatabaseComparisonHelperLocal : DatabaseComparisonHelperBase
	{
        private BookLogic bookLogic;

        public DatabaseComparisonHelperLocal(string connectionString)
		{
			var dal = new DALImplementation(connectionString);
			bookLogic = new BookLogic(dal);
		}

		public IEnumerable<Book> GetExistingBooks()
		{
			return bookLogic.GetAllBooks();
		}

		public override ComparisonContainer<Book> GetComparisonContainer(IEnumerable<Book> existingBooks, IEnumerable<Book> newBooks)
		{
			return new Shared.Library.BookSetComparer().GetComparisonContainer(existingBooks, newBooks);
		}

		public  override void EchoComparisonSetDetails(ComparisonContainer<Book> container)
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

		public  override async Task SaveExistingItems(ComparisonContainer<Book> container)
		{
			System.Console.WriteLine($"Saving {container.ExistingItems.Count()} existing books");
			foreach(var book in container.ExistingItems)
			{
				bookLogic.Save(book);
				EchoWrittenBook(book);
			} 
			await Task.CompletedTask;
		}

		public  override async Task SaveNewItems(ComparisonContainer<Book> container)
		{
			System.Console.WriteLine($"Saving {container.NewItems.Count()} new books");
			foreach(var book in container.NewItems)
			{
				bookLogic.Save(book);
				EchoWrittenBook(book);
			} 
			await Task.CompletedTask;
		}

		private void EchoWrittenBook(Book book)
		{
			System.Console.WriteLine($"Wrote book: {book.Author} - {book.Title} (Identifier {book.Identifier}-> ID: {book.BookID}");
		}
	}
}

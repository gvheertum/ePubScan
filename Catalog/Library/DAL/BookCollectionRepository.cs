using System.Collections.Generic;
using Models;
using System.Linq;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
namespace Library.DAL
{
	public class RepositoryBase
	{
	}

	public class BookRepository : RepositoryBase
	{
		private EpubCatalogContext GetContext()
		{
			return new EpubCatalogContext(EpubCatalogContext.GetConfig());
		}

		public List<Book> GetBooks()
		{
			using(var context = GetContext())
			{
				return context.Books.ToList();
			}
		}

		public Book GetBook(int identifier)
		{
			using(var context = GetContext())
			{
				return context.Books.FirstOrDefault(b => b.BookID == identifier);
			}
		}

		
	}
}
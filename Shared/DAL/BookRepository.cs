using System.Collections.Generic;
using System.Linq;
using ePubAnalyzer.Shared.Entities;
using System;
using System.Collections;

namespace ePubAnalyzer.Shared.DAL
{
	public class RepositoryBase
	{
	}

	public class BookRepository : RepositoryBase
	{
		private readonly Func<EpubCatalogContext> _contextFunc;

		public BookRepository(Func<EpubCatalogContext> getContextFunc)
		{
			_contextFunc = getContextFunc;
		}
		private EpubCatalogContext GetContext()
		{
			return _contextFunc();
		}

		public List<Book> GetBooks()
		{
			using(var context = GetContext())
			{
				return context.Books.ToList();
			}
		}

		public Book Save(Book input)
		{
			using(var ctx = GetContext())
			{
				ctx.Update(input);
				// if(input.BookID == null) 
				// {
				// 	ctx.Books.Add(input);
				// }
				// else
				// {
				// 	ctx.Attach(input);
				// }	
				ctx.SaveChanges();
			}
			return input;
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
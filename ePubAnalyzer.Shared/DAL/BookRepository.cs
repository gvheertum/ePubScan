using System.Collections.Generic;
using System.Linq;
using ePubAnalyzer.Shared.Entities;
using System;
using Microsoft.EntityFrameworkCore;

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
				return context.Books
					.AsNoTracking()
					.OrderByDescending(b => b.BookID)
					.ToList();
			}
		}

		public Book Save(Book input)
		{
			using(var ctx = GetContext())
			{
				ctx.Update(input);
				ctx.SaveChanges();
			}
			return input;
		}

		public Book GetBook(int identifier)
		{
			using(var context = GetContext())
			{
				return context.Books
					.AsNoTracking()
					.FirstOrDefault(b => b.BookID == identifier);
			}
		}

		public Book UpdateDetails(Book input)
		{
			using(var ctx = GetContext())
			{
				var book = new Book { BookID = input.BookID };
				ctx.Books.Attach(book);

				SetIfProvided(ctx, book, b => b.Title, input.Title);
				SetIfProvided(ctx, book, b => b.Author, input.Author);
				SetIfProvided(ctx, book, b => b.Description, input.Description);
				SetIfProvided(ctx, book, b => b.Identifier, input.Identifier);
				SetIfProvided(ctx, book, b => b.Medium, input.Medium);
				SetIfProvided(ctx, book, b => b.NrOfPages, input.NrOfPages);

				ctx.SaveChanges();
			}

			return input;
		}

		public void UpdateReadBadge(int bookID, string readState)
		{
			using(var ctx = GetContext())
			{
				var book = new Book { BookID = bookID, ReadStatus = readState };
				ctx.Books.Attach(book);
				ctx.Entry(book).Property(b => b.ReadStatus).IsModified = true;
				ctx.SaveChanges();
			}
		}

		public void UpdateReadStatus(int bookID, string readState, string readRemark)
		{
			using(var ctx = GetContext())
			{
				var book = new Book { BookID = bookID, ReadStatus = readState, ReadRemark = readRemark };
				ctx.Books.Attach(book);
				ctx.Entry(book).Property(b => b.ReadStatus).IsModified = true;
				ctx.Entry(book).Property(b => b.ReadRemark).IsModified = true;
				ctx.SaveChanges();
			}
		}

		public void UpdateAvailability(int bookID, string status, string statusRemark)
		{
			using(var ctx = GetContext())
			{
				var book = new Book { BookID = bookID, Status = status, StatusRemark = statusRemark };
				ctx.Books.Attach(book);
				ctx.Entry(book).Property(b => b.Status).IsModified = true;
				ctx.Entry(book).Property(b => b.StatusRemark).IsModified = true;
				ctx.SaveChanges();
			}
		}

		private void SetIfProvided<T>(EpubCatalogContext ctx, Book book, System.Linq.Expressions.Expression<Func<Book, T>> property, T value)
		{
			if(value == null) { return; }

			if(value is string text && string.IsNullOrWhiteSpace(text))
			{
				return;
			}

			ctx.Entry(book).Property(property).CurrentValue = value;
			ctx.Entry(book).Property(property).IsModified = true;
		}
	}
}

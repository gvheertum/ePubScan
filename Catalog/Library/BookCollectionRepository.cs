using System.Collections.Generic;
using Models;
using System.Linq;
using System;

namespace Library
{
	public class BookCollectionRepository
	{
		public List<Book> GetBooks()
		{
			return GetAllBooks();
		}

		public Book GetBook(string identifier)
		{
			return GetBooks().FirstOrDefault(b => string.Equals(b.Identifier, identifier, StringComparison.OrdinalIgnoreCase));
		}

		private List<Book> GetAllBooks()
		{
			var books = new List<Book>();
			books.Add(new Book() { Identifier = "Boekje1", Name = "Mijn boek" });
			books.Add(new Book() { Identifier = "Boekje2", Name = "Mijn boek dn 2de" });
			return books;
		}
	}
}
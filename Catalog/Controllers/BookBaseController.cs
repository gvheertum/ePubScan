using System.Collections.Generic;
using ePubAnalyzer.Shared.Entities;

namespace Catalog.Controllers
{
	//Base controller for book handling, this allows us to have a split controller
	//for the json and mvc controllers regarding books.
	public class BookBaseController : BaseController 
	{
		protected IEnumerable<Book> GetAllBooks()
		{
			return GetFrontendHelper().GetLogicFactory().GetBookLogic().GetAllBooks();
		}
		

		protected Book GetBookDetail(int bookID)
		{
			return GetFrontendHelper().GetLogicFactory().GetBookLogic().GetBookByID(bookID);
		}

	
		protected Book UpdateBookDataInternal(Book book)
		{
			//Merge new fields over the original book
			var bookOrig = GetFrontendHelper().GetLogicFactory().GetBookLogic().GetBookByID(book.BookID.Value);
			bookOrig.Title = GetOverrideOrOriginal(bookOrig.Title, book.Title);
			bookOrig.Author = GetOverrideOrOriginal(bookOrig.Author, book.Author);
			bookOrig.Description = GetOverrideOrOriginal(bookOrig.Description, book.Description);
			bookOrig.Identifier = GetOverrideOrOriginal(bookOrig.Identifier, book.Identifier);
			bookOrig.Medium = GetOverrideOrOriginal(bookOrig.Medium, book.Medium);
			//Save and continue
			GetFrontendHelper().GetLogicFactory().GetBookLogic().Save(bookOrig);
			return bookOrig;
		}

		//TODO: this could be done with generics, but for those whopping 5 max fields, nah
		private string GetOverrideOrOriginal(string originalData, string overrideData)
		{
			return !string.IsNullOrWhiteSpace(overrideData) ? overrideData : originalData;
		}
	}
}

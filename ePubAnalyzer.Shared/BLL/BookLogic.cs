using System.Collections.Generic;

namespace ePubAnalyzer.Shared.BLL
{

	public class BookLogic : LogicBase
	{
		internal BookLogic(DAL.IDAL dal) : base(dal) { }

		public IEnumerable<Entities.Book> GetAllBooks()
		{
			return _dal.GetBookRepository().GetBooks();
		}

		public Entities.Book GetBookByID(int bookID)
		{
			return _dal.GetBookRepository().GetBook(bookID);
		}

		public Entities.Book UpdateReadStatus(int bookID, string readState, string readRemark)
		{
			var book = GetBookByID(bookID);
			if(book == null) { throw new System.Exception($"Unknown bookid: {bookID}"); }
			book.ReadStatus = readState;
			book.ReadRemark = readRemark;
			book = Save(book);
			return book;
		}

		public Entities.Book UpdateAvailability(int bookID, string status, string statusRemark)
		{
			var book = GetBookByID(bookID);
			if(book == null) { throw new System.Exception($"Unknown bookid: {bookID}"); }
			book.Status = status;
			book.StatusRemark = statusRemark;
			book = Save(book);
			return book;
		}

		public Entities.Book Save(Entities.Book book)
		{
			return _dal.GetBookRepository().Save(book);
		}

		public Entities.ComparisonContainer<Entities.Book> CompareBooksWithExistingCollection(List<Entities.Book> books)
		{
			return new Library.BookSetComparer().GetComparisonContainer(this.GetAllBooks(), books);
		}
	}
}
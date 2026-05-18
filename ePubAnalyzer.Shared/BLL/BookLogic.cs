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

		public Entities.Book UpdateReadBadge(int bookID, string readState)
		{
			_dal.GetBookRepository().UpdateReadBadge(bookID, readState);
			return new Entities.Book { BookID = bookID, ReadStatus = readState };
		}

		public Entities.Book UpdateReadStatus(int bookID, string readState, string readRemark)
		{
			_dal.GetBookRepository().UpdateReadStatus(bookID, readState, readRemark);
			return new Entities.Book { BookID = bookID, ReadStatus = readState, ReadRemark = readRemark };
		}

		public Entities.Book UpdateAvailability(int bookID, string status, string statusRemark)
		{
			_dal.GetBookRepository().UpdateAvailability(bookID, status, statusRemark);
			return new Entities.Book { BookID = bookID, Status = status, StatusRemark = statusRemark };
		}

		public Entities.Book Save(Entities.Book book)
		{
			return _dal.GetBookRepository().Save(book);
		}

		public Entities.Book UpdateDetails(Entities.Book book)
		{
			return _dal.GetBookRepository().UpdateDetails(book);
		}

		public Entities.ComparisonContainer<Entities.Book> CompareBooksWithExistingCollection(List<Entities.Book> books)
		{
			return new Library.BookSetComparer().GetComparisonContainer(this.GetAllBooks(), books);
		}

		//TODO: validate the read status against a fixed list
	}
}

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
	}
}
using ePubAnalyzer.Shared.Entities;
using ePubAnalyzer.Shared.BLL;

namespace Catalog.API.Helpers
{
    public class BookPartialDataUpdateHelper : PartialDataUpdateHelper<Book>
	{
        private readonly BookLogic bookLogic;

        public BookPartialDataUpdateHelper(BookLogic bookLogic)
		{
			this.bookLogic = bookLogic;
		}

        //Update the fields we know from that we will receive from the function, the others will be left intact
        protected override Book MergeNewDataIntoOriginalObject(Book book, Book bookOrig)
        {
            //Merge new fields over the original book
			bookOrig.Title = GetOverrideOrOriginal(bookOrig.Title, book.Title);
			bookOrig.Author = GetOverrideOrOriginal(bookOrig.Author, book.Author);
			bookOrig.Description = GetOverrideOrOriginal(bookOrig.Description, book.Description);
			bookOrig.Identifier = GetOverrideOrOriginal(bookOrig.Identifier, book.Identifier);
			bookOrig.Medium = GetOverrideOrOriginal(bookOrig.Medium, book.Medium);
			bookOrig.NrOfPages = GetOverrideOrOriginal(bookOrig.NrOfPages, book.NrOfPages);
			if(bookOrig.NrOfPages == 0) { book.NrOfPages = null; }
			return bookOrig;
        }

        //The original will be retrieved based on the input ID
        protected override Book RetrieveOriginal(Book input)
        {
        	return bookLogic.GetBookByID(input.BookID.Value);
        }
    }
}

using System;
using ePubAnalyzer.Shared.Entities;

namespace ePubAnalyzer.Shared.Library
{
	public class BookSetComparer : SetComparer<Book>
	{
		public BookSetComparer() 
		{
			//Check if the bookID or identifier match
			_existingItemCheck = (b1,b2) => {
				return string.Equals(b1.Identifier, b2.Identifier, StringComparison.OrdinalIgnoreCase) ||
					b1.BookID == b2.BookID;
			};
			
			//Merge the Ids of the orig in the new book
			_mergeOriginalIntoNew = (bOrig, bNew) => {
				bNew.BookID = bOrig.BookID;
				return bNew;
			};
		}
	}
}
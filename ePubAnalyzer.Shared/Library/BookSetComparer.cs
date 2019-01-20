using System;
using ePubAnalyzer.Shared.Entities;

namespace ePubAnalyzer.Shared.Library
{
	public class BookSetComparer : SetComparer<Book>
	{
		public BookSetComparer() 
		{
			//Check if the bookID or identifier match
			_existingItemCheck = (b1,b2) => 
			{
				return 
					//Look for a match on the identifier, exclude identifiers with uuid that match
					(!string.IsNullOrWhiteSpace(b1.Identifier) && !b1.Identifier.StartsWith("urn:uuid:") && string.Equals(b1.Identifier, b2.Identifier, StringComparison.OrdinalIgnoreCase)) ||
					(b1.BookID != null && b1.BookID == b2.BookID) ||
					(string.Equals(b1.Author, b2.Author, StringComparison.OrdinalIgnoreCase) && string.Equals(b1.Title, b2.Title, StringComparison.OrdinalIgnoreCase));
			};
			
			//Merge the Ids of the orig in the new book
			_mergeOriginalIntoNew = (bOrig, bNew) => 
			{
				bNew.BookID = bOrig.BookID;
				return bNew;
			};
		}
	}
}
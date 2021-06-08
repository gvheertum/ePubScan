namespace ePubAnalyzer.Shared.API
{
    public class HttpRoutes
    {
        public const string GetBooksAll = "Books/All";
        public const string AddBook = "Book/Add";
        public const string GetBookDetail = "Book/{bookIDParam:int}/Detail";
        public const string SetBookData = "Book/{bookIDParam:int}/UpdateBookData";
        public const string SetBookReadBadge = "Book/{bookIDParam:int}/UpdateReadBadge";
        public const string SetBookReadStatus = "Book/{bookIDParam:int}/UpdateReadStatus";
        public const string SetBookAvailabilityStatus = "Book/{bookIDParam:int}/UpdateAvailabilityStatus";
    }
}
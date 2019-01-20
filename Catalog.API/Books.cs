
using System.IO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.WebJobs.Host;
using Newtonsoft.Json;
using System.Linq;
using System.Collections.Generic;
using ePubAnalyzer.Shared.Entities;
using ePubAnalyzer.Shared.DAL;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.Json;
using System;
namespace Catalog.API
{

	public class BookJsonController
	{

		// [HttpGet("api/books/all")]
        [FunctionName("GetBooks")]
		public static IActionResult Books([HttpTrigger(AuthorizationLevel.Function, "get", Route = "Books/All")]HttpRequest req, TraceWriter log)
		{
            try{
			return new OkObjectResult(GetAllBooks());

            }
            catch(Exception e)
            {
                return new BadRequestObjectResult(e.ToString());
            }
		}

		// [HttpGet("api/books/book/{bookRouteID}")]
        [FunctionName("GetBookDetail")]
		public static IActionResult Details([HttpTrigger(AuthorizationLevel.Function, "get", Route = "Book/Detail")]int? bookID)
		{
            if(bookID == null) { return new BadRequestObjectResult("Please fill the bookID"); }
			return new OkObjectResult(GetBookDetail(bookID.Value));
		}

		// [HttpPost("api/books/book/{bookRouteID}/update")]
		public IActionResult UpdateBookData([FromBody] Book input)
		{
			ValidatePostAgainstRoute(input);
			input = UpdateBookDataInternal(input);			
			return new OkObjectResult(true);
		}

		// [HttpPost("api/books/book/{bookRouteID}/readstatus")]
		public IActionResult UpdateReadStatus([FromBody] Book input)
		{
			ValidatePostAgainstRoute(input);
			UpdateReadStatusInternal(input.BookID.Value, input.ReadStatus, input.ReadRemark);
			return new OkObjectResult(true);
		}

		// [HttpPost("api/books/book/{bookRouteID}/availabilitystatus")]
		public IActionResult UpdateAvailabilityStatus([FromBody] Book input)
		{
			ValidatePostAgainstRoute(input);
			UpdateAvailabilityStatusInternal(input.BookID.Value, input.Status, input.StatusRemark);
			return new OkObjectResult(true);
		}

        //TODO: Are we going to need a validation? Functions don't seem to use the specific routes for this.
		private void ValidatePostAgainstRoute(Book book)
		{
			// var parsedBookIDInRoute = this.RouteData.Values.FirstOrDefault(kp => string.Equals(kp.Key, "bookRouteID", StringComparison.OrdinalIgnoreCase));
			// if(parsedBookIDInRoute.Value == null) { throw new Exception("No bookID in route"); }
			// if(!Int32.TryParse(parsedBookIDInRoute.Value as string, out int bookID)) { throw new Exception("Not a valid bookID"); };
			// if(bookID != book.BookID) { throw new Exception("Invalid call, route and data are not matching"); }
		}

        //TODO: This is ripped from the KO project, check if we can collapse some of the elements into each other
        protected static IEnumerable<Book> GetAllBooks()
		{
			return GetBookLogic().GetAllBooks();
		}
		

		protected static Book GetBookDetail(int bookID)
		{
			return GetBookLogic().GetBookByID(bookID);
		}
	
		protected Book UpdateBookDataInternal(Book book)
		{
			//Merge new fields over the original book
			var bookOrig = GetBookLogic().GetBookByID(book.BookID.Value);
			bookOrig.Title = GetOverrideOrOriginal(bookOrig.Title, book.Title);
			bookOrig.Author = GetOverrideOrOriginal(bookOrig.Author, book.Author);
			bookOrig.Description = GetOverrideOrOriginal(bookOrig.Description, book.Description);
			bookOrig.Identifier = GetOverrideOrOriginal(bookOrig.Identifier, book.Identifier);
			bookOrig.Medium = GetOverrideOrOriginal(bookOrig.Medium, book.Medium);
			bookOrig.NrOfPages = GetOverrideOrOriginal(bookOrig.NrOfPages, book.NrOfPages);
			if(bookOrig.NrOfPages == 0) { book.NrOfPages = null; }
			//Save and continue
			GetBookLogic().Save(bookOrig);
			return bookOrig;
		}

		protected void UpdateReadStatusInternal(int bookID, string readStatus, string readRemark)
		{
			GetBookLogic().UpdateReadStatus(bookID, readStatus, readRemark);
		}

		protected void UpdateAvailabilityStatusInternal(int bookID, string bookStatus, string statusRemark)
		{
			GetBookLogic().UpdateAvailability(bookID, bookStatus, statusRemark);
		}

		//TODO: this could be done with generics, but for those whopping 5 max fields, nah
		private string GetOverrideOrOriginal(string originalData, string overrideData)
		{
			return !string.IsNullOrWhiteSpace(overrideData) ? overrideData : originalData;
		}

		private int? GetOverrideOrOriginal(int? originalData, int? overrideData)
		{
			return overrideData != null ? overrideData : originalData;
		}

        
        public static ePubAnalyzer.Shared.BLL.BookLogic GetBookLogic()
        {
            return GetLogicFactory().GetBookLogic();
        }

        //TODO: Isolate?

		private static ePubAnalyzer.Shared.BLL.LogicFactory GetLogicFactory()
		{
			return new ePubAnalyzer.Shared.BLL.LogicFactory(GetDALImplementation());
		}

        private static DALImplementation GetDALImplementation()
		{
			var cString = Environment.GetEnvironmentVariable("ConnectionStrings:DefaultConnection");
            Console.WriteLine($"Connecting with: {cString}");
			return new DALImplementation(cString);
		}

	}
}
using System;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Catalog.Models;
using ePubAnalyzer.Shared.Entities;
using System.Collections.Generic;

namespace Catalog.Controllers
{
	public class BookContainer
	{
		public IEnumerable<Book> Books {get;set;}
		public string RouteGetDetails {get;set;}
		public string RouteUpdateDetails {get;set;}
		public string RouteUpdateReadStatus {get;set;}
		public string RouteUpdateAvailabilityStatus {get;set;}
	}

	public class BookJsonController : BookBaseController
	{

		[HttpGet("api/books/all")]
		public IActionResult Books()
		{
			BookContainer c = new BookContainer();
			c.Books = GetAllBooks();
			c.RouteGetDetails = Url.Action(nameof(Details), new { bookRouteID = "BOOKID"});
			c.RouteUpdateAvailabilityStatus = Url.Action(nameof(UpdateAvailabilityStatus), new { bookRouteID = "BOOKID"});
			c.RouteUpdateReadStatus = Url.Action(nameof(UpdateReadStatus), new { bookRouteID = "BOOKID"});
			c.RouteUpdateDetails = Url.Action(nameof(UpdateBookData), new { bookRouteID = "BOOKID"});
			return Json(c);
		}

		[HttpGet("api/books/book/{bookRouteID}")]
		public IActionResult Details(int? bookRouteID)
		{
			return Json(GetBookDetail(bookRouteID.Value));
		}

		[HttpPost("api/books/book/{bookRouteID}/readstatus")]
		public IActionResult UpdateReadStatus(Book book)
		{
			ValidatePostAgainstRoute(book);
			UpdateReadStatusInternal(book.BookID.Value, book.ReadStatus, book.ReadRemark);
			return Json(true);
		}

		[HttpPost("api/books/book/{bookRouteID}/availabilitystatus")]
		public IActionResult UpdateAvailabilityStatus(Book book)
		{
			ValidatePostAgainstRoute(book);
			UpdateAvailabilityStatusInternal(book.BookID.Value, book.Status, book.StatusRemark);
			return Json(true);
		}

		[HttpPost("api/books/book/{bookRouteID}/")]
		public IActionResult UpdateBookData(Book book)
		{
			ValidatePostAgainstRoute(book);
			book = UpdateBookDataInternal(book);			
			return Json(true);
		}

		private void ValidatePostAgainstRoute(Book book)
		{
			var parsedBookIDInRoute = this.RouteData.Values.FirstOrDefault(kp => string.Equals(kp.Key, "bookRouteID", StringComparison.OrdinalIgnoreCase));
			if(parsedBookIDInRoute.Value == null) { throw new Exception("No bookID in route"); }
			if(!Int32.TryParse(parsedBookIDInRoute.Value as string, out int bookID)) { throw new Exception("Not a valid bookID"); };
			if(bookID != book.BookID) { throw new Exception("Invalid call, route and data are not matching"); }
		}
	}
}

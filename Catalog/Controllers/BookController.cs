using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Catalog.Models;
using ePubAnalyzer.Shared.Entities;

namespace Catalog.Controllers
{
	public class BookController : BaseController
    {
        public IActionResult Index()
        {
            return View(GetFrontendHelper().GetLogicFactory().GetBookLogic().GetAllBooks());
        }

		public IActionResult Details(int? id)
		{
			return View(GetFrontendHelper().GetLogicFactory().GetBookLogic().GetBookByID(id.Value));
		}

		public IActionResult UpdateReadStatus(Book book)
		{
			GetFrontendHelper().GetLogicFactory().GetBookLogic().UpdateReadStatus(book.BookID.Value, book.ReadStatus, book.ReadRemark);
			return RedirectToAction("Details", new { id = book.BookID});
		}

		public IActionResult UpdateAvailabilityStatus(Book book)
		{
			GetFrontendHelper().GetLogicFactory().GetBookLogic().UpdateAvailability(book.BookID.Value, book.Status, book.StatusRemark);
			return RedirectToAction("Details", new { id = book.BookID});
		}

		public IActionResult UpdateBookData(Book book)
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
			return RedirectToAction("Details", new { id = book.BookID});
		}

		//TODO: this could be done with generics, but for those whopping 5 max fields, nah
		private string GetOverrideOrOriginal(string originalData, string overrideData)
		{
			return !string.IsNullOrWhiteSpace(overrideData) ? overrideData : originalData;
		}
    }
}

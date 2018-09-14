using System;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Catalog.Models;
using ePubAnalyzer.Shared.Entities;

namespace Catalog.Controllers
{

	public class BookController : BookBaseController
    {
 		public IActionResult Index()
        {
            return View(GetAllBooks());
        }

		public IActionResult Details(int? id)
		{
			return View(GetBookDetail(id.Value));
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
			book = UpdateBookDataInternal(book);
			return RedirectToAction("Details", new {id = book.BookID});
		}

    }
}

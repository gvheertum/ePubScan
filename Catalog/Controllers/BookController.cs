using System;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Catalog.Models;
using ePubAnalyzer.Shared.Entities;

namespace Catalog.Controllers
{
	//TODO: The fields in the model can be split to serve only the required data to the routes/actions (now we flush the full model, however only with the limited usage but still)
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
			UpdateReadStatusInternal(book.BookID.Value, book.ReadStatus, book.ReadRemark);
			return RedirectToAction("Details", new { id = book.BookID});
		}

		public IActionResult UpdateAvailabilityStatus(Book book)
		{
			UpdateAvailabilityStatusInternal(book.BookID.Value, book.Status, book.StatusRemark);
			return RedirectToAction("Details", new { id = book.BookID});
		}

		public IActionResult UpdateBookData(Book book)
		{
			book = UpdateBookDataInternal(book);
			return RedirectToAction("Details", new {id = book.BookID});
		}

    }
}

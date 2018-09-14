using System;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Catalog.Models;
using ePubAnalyzer.Shared.Entities;

namespace Catalog.Controllers
{
	public class BookJsonController : BookBaseController
	{

		[HttpGet("api/books/all")]
		public IActionResult Books()
		{
			return Json(base.GetAllBooks());
		}

		[HttpGet("api/books/book/{bookID}")]
		public IActionResult Book(int? bookID)
		{
			return Json(GetBookDetail(bookID.Value));
		}
	}
}

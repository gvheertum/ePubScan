using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Catalog.Models;

namespace Catalog.Controllers
{
    public class BookController : Controller
    {
        public IActionResult Index()
        {
            return View(new Library.BookCollectionRepository().GetBooks());
        }

		public IActionResult Details(string id)
		{
			return View(new Library.BookCollectionRepository().GetBook(id));
		}
    }
}

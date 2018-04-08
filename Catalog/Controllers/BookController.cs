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
            return View(new Library.DAL.BookRepository().GetBooks());
        }

		public IActionResult Details(int? id)
		{
			return View(new Library.DAL.BookRepository().GetBook(id.Value));
		}
    }
}

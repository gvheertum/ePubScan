using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Catalog.Models;

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
    }
}

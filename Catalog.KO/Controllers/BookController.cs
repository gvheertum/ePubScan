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
	//TODO: The fields in the model can be split to serve only the required data to the routes/actions (now we flush the full model, however only with the limited usage but still)
	public class BookController : Controller
    {
 		public IActionResult Index()
        {
            return View(new List<Book>());
        }
    }
}

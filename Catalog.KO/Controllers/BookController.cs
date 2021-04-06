using System;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Catalog.Models;
using ePubAnalyzer.Shared.Entities;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;

namespace Catalog.Controllers
{
	//TODO: The fields in the model can be split to serve only the required data to the routes/actions (now we flush the full model, however only with the limited usage but still)
	public class BookController : Controller
    {
        private IConfiguration configuration;

        public BookController(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

 		public IActionResult Index()
        {
            string apiRootUrl = configuration["CatalogAPIRootUrl"];
            if(string.IsNullOrWhiteSpace(apiRootUrl)) { throw new Exception("Missing configuration key: CatalogAPIRootUrl"); }
            apiRootUrl = apiRootUrl.EndsWith("/") ? apiRootUrl : apiRootUrl + "/"; //Ensure trailing slash
            return View(new CatalogConfiguration() { CatalogApiRootUrl = apiRootUrl });
        }
    }
}

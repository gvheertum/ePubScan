using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using ePubAnalyzer.Shared.Entities;
using Catalog.API.ResultObjects;

namespace Catalog.API
{
    public interface IBooksReadFunction
	{
		Task<IActionResult<IEnumerable<Book>>> Books(
			HttpRequest req,
			ILogger log,
			ExecutionContext context);
	
		Task<IActionResult<Book>> Details(
			HttpRequest req,
			ILogger log,
			ExecutionContext context,
			int bookIDParam);
	}
}

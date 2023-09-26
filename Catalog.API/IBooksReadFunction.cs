using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using ePubAnalyzer.Shared.Entities;
using Catalog.API.ResultObjects;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace Catalog.API
{
    public interface IBooksReadFunction
	{
		Task<IActionResult<IEnumerable<Book>>> Books(
			HttpRequestData req,
            FunctionContext context);
	
		Task<IActionResult<Book>> Details(
			HttpRequestData req,
            FunctionContext context,
			int bookIDParam);
	}
}

using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using ePubAnalyzer.Shared.Entities;
using Catalog.API.Models;
using Catalog.API.ResultObjects;
namespace Catalog.API
{
    //TODO: Perhaps a shared interface might work here to ensure both the options as the regular interface have the same functions embedded
    public class BooksFunctionOptions
	{
		[FunctionName("Options_UpdateBookData")]
		public async Task<IActionResult<bool>> UpdateBookData(
		   [HttpTrigger(AuthorizationLevel.Anonymous, "options", Route = BooksFunction.HttpRoutes.SetBookData)] Book input,
		   HttpRequest req,
		   ILogger log,
		   ExecutionContext context,
		   int bookIDParam)
		{
			return new OkObjectResult<bool>(true);
		}
		[FunctionName("Options_UpdateAvailabilityStatus")]
		public async Task<IActionResult<bool>> UpdateAvailabilityStatus(
			[HttpTrigger(AuthorizationLevel.Anonymous, "options", Route = BooksFunction.HttpRoutes.SetBookAvailabilityStatus)] BookAvailabilityStatusUpdateModel input,
			HttpRequest req,
			ILogger log,
			ExecutionContext context,
			int bookIDParam)
		{
			return new OkObjectResult<bool>(true);
		}

		
		[FunctionName("Options_UpdateReadStatus")]
		public async Task<IActionResult> UpdateReadStatus(
			[HttpTrigger(AuthorizationLevel.Anonymous, "options", Route = BooksFunction.HttpRoutes.SetBookReadStatus)] BookReadStatusUpdateModel input,
			HttpRequest req,
			ILogger log,
			ExecutionContext context,
			int bookIDParam)
		{
			return new OkObjectResult(true);
		}
	}
}

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

	//Function implemenations for the OPTIONS requests, this is only done pre-flight for the post methods, getters do not need this
    public class BooksFunctionOptions : IBooksWriteFunction
	{
		[FunctionName("Options_UpdateBookData")]
		public async Task<IActionResult<bool>> UpdateBookData(
		   [HttpTrigger(AuthorizationLevel.Anonymous, "options", Route = BooksFunction.HttpRoutes.SetBookData)] BookSaveModel input,
		   HttpRequest req,
		   ILogger log,
		   ExecutionContext context,
		   int bookIDParam)
		{
			return new OkObjectResult<bool>(req, true);
		}

		[FunctionName("Options_UpdateAvailabilityStatus")]
		public async Task<IActionResult<bool>> UpdateAvailabilityStatus(
			[HttpTrigger(AuthorizationLevel.Anonymous, "options", Route = BooksFunction.HttpRoutes.SetBookAvailabilityStatus)] BookAvailabilityStatusUpdateModel input,
			HttpRequest req,
			ILogger log,
			ExecutionContext context,
			int bookIDParam)
		{
			return new OkObjectResult<bool>(req, true);
		}

		[FunctionName("Options_UpdateReadBadge")]
		public async Task<IActionResult> UpdateReadBadge(
			[HttpTrigger(AuthorizationLevel.Anonymous, "options", Route = BooksFunction.HttpRoutes.SetBookReadBadge)] BookReadBadgeUpdateModel input,
			HttpRequest req,
			ILogger log,
			ExecutionContext context,
			int bookIDParam)
		{
			return new OkObjectResult<bool>(req, true);
		}

		[FunctionName("Options_UpdateReadStatus")]
		public async Task<IActionResult> UpdateReadStatus(
			[HttpTrigger(AuthorizationLevel.Anonymous, "options", Route = BooksFunction.HttpRoutes.SetBookReadStatus)] BookReadStatusUpdateModel input,
			HttpRequest req,
			ILogger log,
			ExecutionContext context,
			int bookIDParam)
		{
			return new OkObjectResult<bool>(req, true);
		}
	}
}

using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Collections.Generic;
using ePubAnalyzer.Shared.Entities;
using ePubAnalyzer.Shared.DAL;
using Microsoft.Extensions.Configuration;
using Catalog.API.Models;
using Microsoft.Extensions.DependencyInjection;
using ePubAnalyzer.Shared.BLL;
using Catalog.API.ResultObjects;
using Catalog.API.Helpers;

namespace Catalog.API
{
    public class BooksFunction
	{
		public class HttpRoutes
		{
			public const string GetBooksAll = "Books/All";
			public const string GetBookDetail = "Book/{bookIDParam:int}/Detail";
			public const string SetBookData = "Book/{bookIDParam:int}/UpdateBookData";
			public const string SetBookReadStatus = "Book/{bookIDParam:int}/UpdateReadStatus";
			public const string SetBookAvailabilityStatus = "Book/{bookIDParam:int}/UpdateAvailabilityStatus";
		}

		private readonly BookLogic bookLogic;
		private readonly BookPartialDataUpdateHelper bookPartialDataUpdateHelper;

		public BooksFunction(BookLogic bookLogic, BookPartialDataUpdateHelper bookPartialDataUpdateHelper)
		{
			this.bookLogic = bookLogic;
			this.bookPartialDataUpdateHelper = bookPartialDataUpdateHelper;
		}

		[FunctionName("GetBooks")]
		public IActionResult<IEnumerable<Book>> Books(
			[HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = HttpRoutes.GetBooksAll)] HttpRequest req,
			ILogger log,
			ExecutionContext context)
		{
			log.LogInformation($"Retrieving all books");
			try
			{
				return new OkObjectResult<IEnumerable<Book>>(bookLogic.GetAllBooks());
			}
			catch (Exception e)
			{
				return new BadRequestObjectResult<IEnumerable<Book>>(e.ToString());
			}
		}

		[FunctionName("GetBookDetail")]
		public async Task<IActionResult<Book>> Details(
			[HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = HttpRoutes.GetBookDetail)] HttpRequest req,
			ILogger log,
			ExecutionContext context,
			int bookIDParam)
		{
			if (bookIDParam == 0) { return new BadRequestObjectResult<Book>("Please fill the bookID"); }

			log.LogInformation($"Retrieving details for id {bookIDParam}");;
			return new OkObjectResult<Book>(bookLogic.GetBookByID(bookIDParam));
		}

		[FunctionName("UpdateBookData")]
		public async Task<IActionResult<bool>> UpdateBookData(
			[HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = HttpRoutes.SetBookData)] Book input,
			HttpRequest req,
			ILogger log,
			ExecutionContext context,
			int bookIDParam)
		{
			if (bookIDParam != input.BookID) { return new BadRequestObjectResult<bool>($"ID in post and url were not equal: {bookIDParam} vs {input.BookID}"); }

			log.LogInformation($"Saving: {input.Title} with id {input.BookID}");
			input = bookPartialDataUpdateHelper.MergeNewDataInOriginal(input);
			bookLogic.Save(input);

			return new OkObjectResult<bool>(true);
		}

		
		[FunctionName("UpdateReadStatus")]
		public async Task<IActionResult> UpdateReadStatus(
		[HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = HttpRoutes.SetBookReadStatus)] BookReadStatusUpdateModel input,
		HttpRequest req,
		ILogger log,
		ExecutionContext context,
		int bookIDParam)
		{
			if (bookIDParam != input.BookID) { return new BadRequestObjectResult<bool>($"ID in post and url were not equal: {bookIDParam} vs {input.BookID}"); }

			log.LogInformation($"UpdateReadStatus: {input.ReadStatus} ({input.ReadRemark}) with id {input.BookID}");
			bookLogic.UpdateReadStatus(input.BookID, input.ReadStatus, input.ReadRemark);

			return new OkObjectResult(true);
		}



		[FunctionName("UpdateAvailabilityStatus")]
		public async Task<IActionResult<bool>> UpdateAvailabilityStatus(
			[HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = HttpRoutes.SetBookAvailabilityStatus)] BookAvailabilityStatusUpdateModel input,
			HttpRequest req,
			ILogger log,
			ExecutionContext context,
			int bookIDParam)
		{
			if (bookIDParam != input.BookID) { return new BadRequestObjectResult<bool>($"ID in post and url were not equal: {bookIDParam} vs {input.BookID}"); }

			log.LogInformation($"UpdateAvailabilityStatus: {input.Status} ({input.StatusRemark}) with id {input.BookID}");
			bookLogic.UpdateAvailability(input.BookID, input.Status, input.StatusRemark);

			return new OkObjectResult<bool>(true);
		}

		
	}
}

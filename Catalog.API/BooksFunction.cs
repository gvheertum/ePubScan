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
using ePubAnalyzer.Shared.API;

namespace Catalog.API
{
    public class BooksFunction : IBooksReadFunction, IBooksWriteFunction
	{
		
		private readonly BookLogic bookLogic;
		private readonly BookPartialDataUpdateHelper bookPartialDataUpdateHelper;

		public BooksFunction(BookLogic bookLogic, BookPartialDataUpdateHelper bookPartialDataUpdateHelper)
		{
			this.bookLogic = bookLogic;
			this.bookPartialDataUpdateHelper = bookPartialDataUpdateHelper;
		}

		[FunctionName("GetBooks")]
		public async Task<IActionResult<IEnumerable<Book>>> Books(
			[HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = HttpRoutes.GetBooksAll)] HttpRequest req,
			ILogger log,
			ExecutionContext context)
		{
			log.LogInformation($"Retrieving all books");
			try
			{
				return new OkObjectResult<IEnumerable<Book>>(req, bookLogic.GetAllBooks());
			}
			catch (Exception e)
			{
				return new BadRequestObjectResult<IEnumerable<Book>>(req, e.ToString());
			}
		}

		[FunctionName("GetBookDetail")]
		public async Task<IActionResult<Book>> Details(
			[HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = HttpRoutes.GetBookDetail)] HttpRequest req,
			ILogger log,
			ExecutionContext context,
			int bookIDParam)
		{
			if (bookIDParam == 0) { return new BadRequestObjectResult<Book>(req, "Please fill the bookID"); }

			log.LogInformation($"Retrieving details for id {bookIDParam}");;
			return new OkObjectResult<Book>(req, bookLogic.GetBookByID(bookIDParam));
		}

		
		[FunctionName("UpdateBookData")]
		public async Task<IActionResult<Book>> UpdateBookData(
			[HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = HttpRoutes.SetBookData)] BookSaveModel input,
			HttpRequest req,
			ILogger log,
			ExecutionContext context,
			int bookIDParam)
		{
			if(!TryValidateBookId<Book>(bookIDParam, input, req, out var result)) { return result; }

			log.LogInformation($"Saving: {input.Title} with id {input.BookID}");
			var combined = bookPartialDataUpdateHelper.MergeNewDataInOriginal(input);
			bookLogic.Save(combined);

			return new OkObjectResult<Book>(req, combined);
		}
		
		[FunctionName("AddBook")]
		public async Task<IActionResult<Book>> AddBook(
			[HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = HttpRoutes.AddBook)] Book input,
			HttpRequest req,
			ILogger log,
			ExecutionContext context)
		{
			if((input?.BookID ?? 0) > 0) { return new BadRequestObjectResult<Book>(req, "Newly added book should NOT have an ID set"); }

			log.LogInformation($"Saving: {input.Title}");
			bookLogic.Save(input);
			log.LogInformation($"Received Id= {input.BookID}");

			return new OkObjectResult<Book>(req, input);
		}


		[FunctionName("UpdateReadBadge")]
		public async Task<IActionResult<bool>> UpdateReadBadge(
			[HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = HttpRoutes.SetBookReadBadge)] BookReadBadgeUpdateModel input,
			HttpRequest req,
			ILogger log,
			ExecutionContext context,
			int bookIDParam)
		{
			if(!TryValidateBookId<bool>(bookIDParam, input, req, out var result)) { return result; }

			log.LogInformation($"UpdateReadBadge: {input.ReadStatus}  with id {input.BookID}");
			bookLogic.UpdateReadBadge(input.BookID.Value, input.ReadStatus);

			return new OkObjectResult<bool>(req, true);
		}

		[FunctionName("UpdateReadStatus")]
		public async Task<IActionResult<bool>> UpdateReadStatus(
		[HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = HttpRoutes.SetBookReadStatus)] BookReadStatusUpdateModel input,
		HttpRequest req,
		ILogger log,
		ExecutionContext context,
		int bookIDParam)
		{
			if(!TryValidateBookId<bool>(bookIDParam, input, req, out var result)) { return result; }

			log.LogInformation($"UpdateReadStatus: {input.ReadStatus} ({input.ReadRemark}) with id {input.BookID}");
			bookLogic.UpdateReadStatus(input.BookID.Value, input.ReadStatus, input.ReadRemark);

			return new OkObjectResult<bool>(req, true);
		}

		[FunctionName("UpdateAvailabilityStatus")]
		public async Task<IActionResult<bool>> UpdateAvailabilityStatus(
			[HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = HttpRoutes.SetBookAvailabilityStatus)] BookAvailabilityStatusUpdateModel input,
			HttpRequest req,
			ILogger log,
			ExecutionContext context,
			int bookIDParam)
		{
			if(!TryValidateBookId<bool>(bookIDParam, input, req, out var result)) { return result; }
			
			log.LogInformation($"UpdateAvailabilityStatus: {input.Status} ({input.StatusRemark}) with id {input.BookID}");
			bookLogic.UpdateAvailability(input.BookID.Value, input.Status, input.StatusRemark);

			return new OkObjectResult<bool>(req, true);
		}		

		//Validate a bookId from a request against a model, if failed returning the bad request result
		private bool TryValidateBookId<T>(int bookIDFromRoute, IBookRequestModel bookModel, HttpRequest req, out BadRequestObjectResult<T> errorModel)
		{
			if(bookIDFromRoute <= 0 || bookModel?.BookID == null) 
			{
				errorModel = new BadRequestObjectResult<T>(req, $"ID in post or url were not set: {bookIDFromRoute} / {bookModel?.BookID}"); 
				return false;
			}
			
			if (bookIDFromRoute != bookModel?.BookID) 
			{ 
				errorModel = new BadRequestObjectResult<T>(req, $"ID in post and url were not equal: {bookIDFromRoute} vs {bookModel?.BookID}"); 
				return false; 
			}

			//All is well
			errorModel = null;
			return true;
		}
	}
}
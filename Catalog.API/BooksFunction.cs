using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using ePubAnalyzer.Shared.Entities;
using Catalog.API.Models;
using ePubAnalyzer.Shared.BLL;
using Catalog.API.ResultObjects;
using Catalog.API.Helpers;
using ePubAnalyzer.Shared.API;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace Catalog.API
{
    public class BooksFunction : IBooksReadFunction, IBooksWriteFunction
	{
        
        private readonly BookLogic bookLogic;
		private readonly BookPartialDataUpdateHelper bookPartialDataUpdateHelper;
        private ILogger<BooksFunction> logger;

        public BooksFunction(ILogger<BooksFunction> logger, BookLogic bookLogic, BookPartialDataUpdateHelper bookPartialDataUpdateHelper)
		{
			this.logger = logger;
			this.bookLogic = bookLogic;
			this.bookPartialDataUpdateHelper = bookPartialDataUpdateHelper;
		}

		[Function("GetBooks")]
		public async Task<IActionResult<IEnumerable<Book>>> Books(
			[HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = HttpRoutes.GetBooksAll)] HttpRequestData req,
			FunctionContext context)
		{
			logger.LogInformation($"Retrieving all books");
			try
			{
				return new OkObjectResult<IEnumerable<Book>>(req, bookLogic.GetAllBooks());
			}
			catch (Exception e)
			{
				return new BadRequestObjectResult<IEnumerable<Book>>(req, e.ToString());
			}
		}

		[Function("GetBookDetail")]
		public async Task<IActionResult<Book>> Details(
			[HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = HttpRoutes.GetBookDetail)] HttpRequestData req,
            FunctionContext context,
			int bookIDParam)
		{
			if (bookIDParam == 0) { return new BadRequestObjectResult<Book>(req, "Please fill the bookID"); }

			logger.LogInformation($"Retrieving details for id {bookIDParam}");;
			return new OkObjectResult<Book>(req, bookLogic.GetBookByID(bookIDParam));
		}

		
		[Function("UpdateBookData")]
		public async Task<IActionResult<Book>> UpdateBookData(
			[HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = HttpRoutes.SetBookData)] BookSaveModel input,
			HttpRequestData req,
            FunctionContext context,
			int bookIDParam)
		{
			if(!TryValidateBookId<Book>(bookIDParam, input, req, out var result)) { return result; }

			logger.LogInformation($"Saving: {input.Title} with id {input.BookID}");
			var combined = bookPartialDataUpdateHelper.MergeNewDataInOriginal(input);
			bookLogic.Save(combined);

			return new OkObjectResult<Book>(req, combined);
		}
		
		[Function("AddBook")]
		public async Task<IActionResult<Book>> AddBook(
			[HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = HttpRoutes.AddBook)] Book input,
			HttpRequestData req,
            FunctionContext context)
		{
			if((input?.BookID ?? 0) > 0) { return new BadRequestObjectResult<Book>(req, "Newly added book should NOT have an ID set"); }

			logger.LogInformation($"Saving: {input.Title}");
			bookLogic.Save(input);
			logger.LogInformation($"Received Id= {input.BookID}");

			return new OkObjectResult<Book>(req, input);
		}


		[Function("UpdateReadBadge")]
		public async Task<IActionResult<bool>> UpdateReadBadge(
			[HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = HttpRoutes.SetBookReadBadge)] BookReadBadgeUpdateModel input,
			HttpRequestData req,
            FunctionContext context,
			int bookIDParam)
		{
			if(!TryValidateBookId<bool>(bookIDParam, input, req, out var result)) { return new BadRequestObjectResult<bool>(req, "Failed", false); }

			logger.LogInformation($"UpdateReadBadge: {input.ReadStatus}  with id {input.BookID}");
			bookLogic.UpdateReadBadge(input.BookID.Value, input.ReadStatus);

			return new OkObjectResult<bool>(req, true);
		}

		[Function("UpdateReadStatus")]
		public async Task<IActionResult<bool>> UpdateReadStatus(
		[HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = HttpRoutes.SetBookReadStatus)] BookReadStatusUpdateModel input,
		HttpRequestData req,
        FunctionContext context,
		int bookIDParam)
		{
			if(!TryValidateBookId<bool>(bookIDParam, input, req, out var result)) { return result; }

			logger.LogInformation($"UpdateReadStatus: {input.ReadStatus} ({input.ReadRemark}) with id {input.BookID}");
			bookLogic.UpdateReadStatus(input.BookID.Value, input.ReadStatus, input.ReadRemark);

			return new OkObjectResult<bool>(req, true);
		}

		[Function("UpdateAvailabilityStatus")]
		public async Task<IActionResult<bool>> UpdateAvailabilityStatus(
			[HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = HttpRoutes.SetBookAvailabilityStatus)] BookAvailabilityStatusUpdateModel input,
			HttpRequestData req,
            FunctionContext context,
			int bookIDParam)
		{
			if(!TryValidateBookId<bool>(bookIDParam, input, req, out var result)) { return result; }
			
			logger.LogInformation($"UpdateAvailabilityStatus: {input.Status} ({input.StatusRemark}) with id {input.BookID}");
			bookLogic.UpdateAvailability(input.BookID.Value, input.Status, input.StatusRemark);

			return new OkObjectResult<bool>(req, true);
		}		

		//Validate a bookId from a request against a model, if failed returning the bad request result
		private bool TryValidateBookId<T>(int bookIDFromRoute, IBookRequestModel bookModel, HttpRequestData req, out BadRequestObjectResult<T> errorModel)
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
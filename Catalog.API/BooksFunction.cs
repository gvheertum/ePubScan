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
		public async Task<HttpResponseData> Books(
			[HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = HttpRoutes.GetBooksAll)] HttpRequestData req,
			FunctionContext context)
		{
			logger.LogInformation($"Retrieving all books");
			try
			{
				return await new OkHttpResponseResult<IEnumerable<Book>>().GetResponseData(req, bookLogic.GetAllBooks());
			}
			catch (Exception e)
			{
				return await new BadHttpResponseResult<string>().GetResponseData(req, e.ToString());
			}
		}

		[Function("GetBookDetail")]
		public async Task<HttpResponseData> Details(
			[HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = HttpRoutes.GetBookDetail)] HttpRequestData req,
            FunctionContext context,
			int bookIDParam)
		{
			if (bookIDParam == 0) { return await new BadHttpResponseResult<string>().GetResponseData(req, "Please fill the bookID"); }

			logger.LogInformation($"Retrieving details for id {bookIDParam}");;
			return await new OkHttpResponseResult<Book>().GetResponseData(req, bookLogic.GetBookByID(bookIDParam));
		}

		
		[Function("UpdateBookData")]
		public async Task<HttpResponseData> UpdateBookData(
			[HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = HttpRoutes.SetBookData)] 
			HttpRequestData req,
            FunctionContext context,
			BookSaveModel input,
			int bookIDParam)
		{
			if(!TryValidateBookId<Book>(bookIDParam, input, req, out var result)) { return await new BadHttpResponseResult<string>().GetResponseData(req, result); }

			logger.LogInformation($"Saving: {input.Title} with id {input.BookID}");
			var combined = bookPartialDataUpdateHelper.MergeNewDataInOriginal(input);
			bookLogic.Save(combined);

			return await new OkHttpResponseResult<Book>().GetResponseData(req, combined);
		}
		
		[Function("AddBook")]
		public async Task<HttpResponseData> AddBook(
			[HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = HttpRoutes.AddBook)]
			HttpRequestData req,
            FunctionContext context,
			Book input)
		{
			if((input?.BookID ?? 0) > 0) { return await new BadHttpResponseResult<string>().GetResponseData(req, "Newly added book should NOT have an ID set"); }

			logger.LogInformation($"Saving: {input.Title}");
			bookLogic.Save(input);
			logger.LogInformation($"Received Id= {input.BookID}");

			return await new OkHttpResponseResult<Book>().GetResponseData(req, input);
		}


		[Function("UpdateReadBadge")]
		public async Task<HttpResponseData> UpdateReadBadge(
			[HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = HttpRoutes.SetBookReadBadge)] 
			HttpRequestData req,
            FunctionContext context,
			BookReadBadgeUpdateModel input,
			int bookIDParam)
		{
			if(!TryValidateBookId<bool>(bookIDParam, input, req, out var result)) { return await new BadHttpResponseResult<string>().GetResponseData(req, result); }

			logger.LogInformation($"UpdateReadBadge: {input.ReadStatus}  with id {input.BookID}");
			bookLogic.UpdateReadBadge(input.BookID.Value, input.ReadStatus);

			return await new OkHttpResponseResult<bool>().GetResponseData(req, true);
		}

		[Function("UpdateReadStatus")]
		public async Task<HttpResponseData> UpdateReadStatus(
		[HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = HttpRoutes.SetBookReadStatus)] 
		HttpRequestData req,
        FunctionContext context,
		BookReadStatusUpdateModel input,
		int bookIDParam)
		{
			if(!TryValidateBookId<bool>(bookIDParam, input, req, out var result)) { return await new BadHttpResponseResult<string>().GetResponseData(req, result); }

			logger.LogInformation($"UpdateReadStatus: {input.ReadStatus} ({input.ReadRemark}) with id {input.BookID}");
			bookLogic.UpdateReadStatus(input.BookID.Value, input.ReadStatus, input.ReadRemark);

			return await new OkHttpResponseResult<bool>().GetResponseData(req, true);
		}

		[Function("UpdateAvailabilityStatus")]
		public async Task<HttpResponseData> UpdateAvailabilityStatus(
			[HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = HttpRoutes.SetBookAvailabilityStatus)] 
			HttpRequestData req,
            FunctionContext context,
			BookAvailabilityStatusUpdateModel input,
			int bookIDParam)
		{
			if(!TryValidateBookId<bool>(bookIDParam, input, req, out var result)) { return await new BadHttpResponseResult<string>().GetResponseData(req, result); }
			
			logger.LogInformation($"UpdateAvailabilityStatus: {input.Status} ({input.StatusRemark}) with id {input.BookID}");
			bookLogic.UpdateAvailability(input.BookID.Value, input.Status, input.StatusRemark);

			return await new OkHttpResponseResult<bool>().GetResponseData(req, true);
		}		

		//Validate a bookId from a request against a model, if failed returning the bad request result
		private bool TryValidateBookId<T>(int bookIDFromRoute, IBookRequestModel bookModel, HttpRequestData req, out string errorMessage)
		{
			if(bookIDFromRoute <= 0 || bookModel?.BookID == null) 
			{
				errorMessage = $"ID in post or url were not set: {bookIDFromRoute} / {bookModel?.BookID}"; 
				return false;
			}
			
			if (bookIDFromRoute != bookModel?.BookID) 
			{ 
				errorMessage = $"ID in post and url were not equal: {bookIDFromRoute} vs {bookModel?.BookID}";
				return false; 
			}

			//All is well
			errorMessage = null;
			return true;
		}
	}
}
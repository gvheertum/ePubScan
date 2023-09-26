using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using ePubAnalyzer.Shared.Entities;
using Catalog.API.Models;
using Catalog.API.ResultObjects;
using ePubAnalyzer.Shared.API;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace Catalog.API
{
    //TODO: Perhaps a shared interface might work here to ensure both the options as the regular interface have the same functions embedded

	//Function implemenations for the OPTIONS requests, this is only done pre-flight for the post methods, getters do not need this
    public class BooksFunctionOptions : IBooksWriteFunction
	{
        private ILogger<BooksFunctionOptions> logger;

        public BooksFunctionOptions(ILogger<BooksFunctionOptions> logger)
        {
            this.logger = logger;
        }

        [Function("Options_AddBook")]
        public async Task<HttpResponseData> AddBook(
			[HttpTrigger(AuthorizationLevel.Anonymous, "options", Route = HttpRoutes.AddBook)] Book input,
            HttpRequestData req, 
            FunctionContext context)
        {
			return await new OkHttpResponseResult<Book>().GetResponseData(req, new Book());
        }

		[Function("Options_UpdateBookData")]
		public async Task<HttpResponseData> UpdateBookData(
		   [HttpTrigger(AuthorizationLevel.Anonymous, "options", Route = HttpRoutes.SetBookData)] BookSaveModel input,
           HttpRequestData req,
           FunctionContext context,
		   int bookIDParam)
		{
			return await new OkHttpResponseResult<Book>().GetResponseData(req, new Book());
		}

		[Function("Options_UpdateAvailabilityStatus")]
		public async Task<HttpResponseData> UpdateAvailabilityStatus(
			[HttpTrigger(AuthorizationLevel.Anonymous, "options", Route = HttpRoutes.SetBookAvailabilityStatus)] BookAvailabilityStatusUpdateModel input,
			HttpRequestData req,
            FunctionContext context,
			int bookIDParam)
		{
			return await new OkHttpResponseResult<bool>().GetResponseData(req, true);
		}

		[Function("Options_UpdateReadBadge")]
		public async Task<HttpResponseData> UpdateReadBadge(
			[HttpTrigger(AuthorizationLevel.Anonymous, "options", Route = HttpRoutes.SetBookReadBadge)] BookReadBadgeUpdateModel input,
            HttpRequestData req,
            FunctionContext context,
			int bookIDParam)
		{
			return await new OkHttpResponseResult<bool>().GetResponseData(req, true);
		}

		[Function("Options_UpdateReadStatus")]
		public async Task<HttpResponseData> UpdateReadStatus(
			[HttpTrigger(AuthorizationLevel.Anonymous, "options", Route = HttpRoutes.SetBookReadStatus)] BookReadStatusUpdateModel input,
            HttpRequestData req,
            FunctionContext context,
			int bookIDParam)
		{
			return await new OkHttpResponseResult<bool>().GetResponseData(req, true);
		}
    }
}

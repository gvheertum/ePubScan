using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using ePubAnalyzer.Shared.Entities;
using Catalog.API.Models;
using Catalog.API.ResultObjects;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace Catalog.API
{
    public interface IBooksWriteFunction
	{
		Task<HttpResponseData/*IActionResult<Book>*/> AddBook(
			Book input,
            HttpRequestData req,
            FunctionContext context);

		Task<HttpResponseData/*IActionResult<Book>*/> UpdateBookData(
			BookSaveModel input,
            HttpRequestData req,
            FunctionContext context,
			int bookIDParam);
		
		Task<HttpResponseData/*IActionResult<bool>*/> UpdateReadStatus(
			BookReadStatusUpdateModel input,
            HttpRequestData req,
            FunctionContext context,
			int bookIDParam);

		Task<HttpResponseData/*IActionResult<bool>*/> UpdateReadBadge(
			BookReadBadgeUpdateModel input,
            HttpRequestData req,
            FunctionContext context,
			int bookIDParam);

		Task<HttpResponseData/*IActionResult<bool>*/> UpdateAvailabilityStatus(
			BookAvailabilityStatusUpdateModel input,
			HttpRequestData req,
            FunctionContext context,
			int bookIDParam);
	}
}

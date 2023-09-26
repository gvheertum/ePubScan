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
            HttpRequestData req,
			FunctionContext context,
			Book input);

		Task<HttpResponseData/*IActionResult<Book>*/> UpdateBookData(
            HttpRequestData req,
            FunctionContext context,
			BookSaveModel input,
			int bookIDParam);
		
		Task<HttpResponseData/*IActionResult<bool>*/> UpdateReadStatus(
            HttpRequestData req,
            FunctionContext context,
			BookReadStatusUpdateModel input,
			int bookIDParam);

		Task<HttpResponseData/*IActionResult<bool>*/> UpdateReadBadge(
            HttpRequestData req,
            FunctionContext context,
			BookReadBadgeUpdateModel input,
			int bookIDParam);

		Task<HttpResponseData/*IActionResult<bool>*/> UpdateAvailabilityStatus(
			HttpRequestData req,
            FunctionContext context,
			BookAvailabilityStatusUpdateModel input,
			int bookIDParam);
	}
}

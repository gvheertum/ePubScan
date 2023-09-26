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
		Task<IActionResult<Book>> AddBook(
			Book input,
            HttpRequestData req,
            FunctionContext context);

		Task<IActionResult<Book>> UpdateBookData(
			BookSaveModel input,
            HttpRequestData req,
            FunctionContext context,
			int bookIDParam);
		
		Task<IActionResult<bool>> UpdateReadStatus(
			BookReadStatusUpdateModel input,
            HttpRequestData req,
            FunctionContext context,
			int bookIDParam);

		Task<IActionResult<bool>> UpdateReadBadge(
			BookReadBadgeUpdateModel input,
            HttpRequestData req,
            FunctionContext context,
			int bookIDParam);

		Task<IActionResult<bool>> UpdateAvailabilityStatus(
			BookAvailabilityStatusUpdateModel input,
			HttpRequestData req,
            FunctionContext context,
			int bookIDParam);
	}
}

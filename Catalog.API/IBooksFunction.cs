using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using ePubAnalyzer.Shared.Entities;
using Catalog.API.Models;
using Catalog.API.ResultObjects;

namespace Catalog.API
{
    public interface IBooksWriteFunction
	{
		Task<IActionResult<bool>> UpdateBookData(
			BookSaveModel input,
			HttpRequest req,
			ILogger log,
			ExecutionContext context,
			int bookIDParam);
		
		Task<IActionResult> UpdateReadStatus(
			BookReadStatusUpdateModel input,
			HttpRequest req,
			ILogger log,
			ExecutionContext context,
			int bookIDParam);

		Task<IActionResult> UpdateReadBadge(
			BookReadBadgeUpdateModel input,
			HttpRequest req,
			ILogger log,
			ExecutionContext context,
			int bookIDParam);

		Task<IActionResult<bool>> UpdateAvailabilityStatus(
			BookAvailabilityStatusUpdateModel input,
			HttpRequest req,
			ILogger log,
			ExecutionContext context,
			int bookIDParam);
	}
}

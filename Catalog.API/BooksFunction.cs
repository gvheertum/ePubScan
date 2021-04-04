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

namespace Catalog.API
{

    public class BooksFunction
    {

        private readonly BookLogic bookLogic;

        // public BooksFunction(BookLogic bookLogic)
        // {
        //     this.bookLogic = bookLogic;
        // }

        // [FunctionName("Tester")]
        // public static IActionResult Test(
		// 	[HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Test")]HttpRequest req, 
		// 	ILogger log)
        // {
        //     return new OkObjectResult("blaa");
        // }

    
        // [FunctionName("GetBooks")]
		// public IActionResult<IEnumerable<Book>> Books(
		// 	[HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Books/All")]HttpRequest req, 
		// 	ILogger log, 
		// 	ExecutionContext context)
		// {
        //     try
		// 	{
		// 		return new OkObjectResult<IEnumerable<Book>>(bookLogic.GetAllBooks());

        //     }
        //     catch(Exception e)
        //     {
        //         return new BadRequestObjectResult<IEnumerable<Book>>(e.ToString());
        //     }
		// }

        // [FunctionName("GetBookDetail")]
		// public async Task<IActionResult<Book>> Details(
		// 	[HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Book/{bookIDParam:int}/Detail")]HttpRequest req, 
		// 	ILogger log, 
		// 	ExecutionContext context,
		// 	int bookIDParam)
		// {
        //     if(bookIDParam == 0) { return new BadRequestObjectResult<Book>("Please fill the bookID"); }
		// 	return new OkObjectResult<Book>(bookLogic.GetBookByID(bookIDParam));
		// }

        // [FunctionName("UpdateBookData")]
		// public static async Task<IActionResult<bool>> UpdateBookData(
		// 	[HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "Book/{bookIDParam:int}/UpdateBookData")]Book input, 
		// 	ILogger log,
		// 	ExecutionContext context,
		// 	int bookIDParam)
		// {
		// 	//TODO: What happens when the id and the post object are different?
		// 	//TODO: Validate input object 
		// 	//input = UpdateBookDataInternal(input);			
		// 	if(bookIDParam != input.BookID) { return new BadRequestObjectResult<bool>($"ID in post and url were not equal: {bookIDParam} vs {input.BookID}"); }
		// 	log.LogWarning("Saving is disabled");
		// 	//log.LogInformation($"Saving: {input.Title} with id {input.BookID}");
		// 	return new OkObjectResult<bool>(true);
		// }

		// [FunctionName("UpdateReadStatus")]		
		// public async Task<IActionResult> UpdateReadStatus(
		// 	[HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "Book/{bookIDParam:int}/UpdateReadStatus")] BookReadStatusUpdateModel input,
		// 	ILogger log,
		// 	ExecutionContext context,
		// 	int bookIDParam)
		// {
		// 	//TODO: Validate input object 
		// 	//UpdateReadStatusInternal(input.BookID, input.ReadStatus, input.ReadRemark);
		// 	if(bookIDParam != input.BookID) { return new BadRequestObjectResult<bool>($"ID in post and url were not equal: {bookIDParam} vs {input.BookID}"); }
		// 	log.LogWarning("Saving is disabled");
		// 	log.LogInformation($"UpdateReadStatus: {input.ReadStatus} ({input.ReadRemark}) with id {input.BookID}");
		// 	return new OkObjectResult(true);
		// }

		
		// [FunctionName("UpdateAvailabilityStatus")]		
		// public static async Task<IActionResult<bool>> UpdateAvailabilityStatus(
		// 	[HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "Book/{bookIDParam:int}/UpdateAvailabilityStatus")] BookAvailabilityStatusUpdateModel input,
		// 	ILogger log,
		// 	ExecutionContext context,
		// 	int bookIDParam)
		// {
		// 	if(bookIDParam != input.BookID) { return new BadRequestObjectResult<bool>($"ID in post and url were not equal: {bookIDParam} vs {input.BookID}"); }
		// 	//TODO: Validate input object 
		// 	//UpdateAvailabilityStatusInternal(input.BookID, input.Status, input.StatusRemark);
		// 	log.LogWarning("Saving is disabled");
		// 	log.LogInformation($"UpdateAvailabilityStatus: {input.Status} ({input.StatusRemark}) with id {input.BookID}");
		
		// 	return new OkObjectResult<bool>(true);
		// }

    

     

	
		// private Book UpdateBookDataInternal(Book book)
		// {
		// 	//Merge new fields over the original book
		// 	var bookOrig = bookLogic.GetBookByID(book.BookID.Value);
		// 	bookOrig.Title = GetOverrideOrOriginal(bookOrig.Title, book.Title);
		// 	bookOrig.Author = GetOverrideOrOriginal(bookOrig.Author, book.Author);
		// 	bookOrig.Description = GetOverrideOrOriginal(bookOrig.Description, book.Description);
		// 	bookOrig.Identifier = GetOverrideOrOriginal(bookOrig.Identifier, book.Identifier);
		// 	bookOrig.Medium = GetOverrideOrOriginal(bookOrig.Medium, book.Medium);
		// 	bookOrig.NrOfPages = GetOverrideOrOriginal(bookOrig.NrOfPages, book.NrOfPages);
		// 	if(bookOrig.NrOfPages == 0) { book.NrOfPages = null; }
		// 	//Save and continue
		// 	bookLogic.Save(bookOrig);
		// 	return bookOrig;
		// }

		// private void UpdateReadStatusInternal(int bookID, string readStatus, string readRemark)
		// {
		//     bookLogic.UpdateReadStatus(bookID, readStatus, readRemark);
		// }

		// private void UpdateAvailabilityStatusInternal(int bookID, string bookStatus, string statusRemark)
		// {
		// 	bookLogic.UpdateAvailability(bookID, bookStatus, statusRemark);
		// }

		// //TODO: this could be done with generics, but for those whopping 5 max fields, nah
		// private string GetOverrideOrOriginal(string originalData, string overrideData)
		// {
		// 	return !string.IsNullOrWhiteSpace(overrideData) ? overrideData : originalData;
		// }

		// private int? GetOverrideOrOriginal(int? originalData, int? overrideData)
		// {
		// 	return overrideData != null ? overrideData : originalData;
		// }

        
        

	}
}

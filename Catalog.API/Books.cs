
using System.IO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.WebJobs.Host;
using Newtonsoft.Json;
using System.Linq;
using System.Collections.Generic;
using ePubAnalyzer.Shared.Entities;
using ePubAnalyzer.Shared.DAL;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.Json;
using System;
using Microsoft.Extensions.Logging;
using Catalog.API.Models;

namespace Catalog.API
{
    public class OkObjectResult<T> : OkObjectResult, IActionResult<T>
    {
        public OkObjectResult(T value) : base(value)
        {
        }
    }

    public class BadRequestObjectResult<T> : BadRequestObjectResult, IActionResult<T>
    {
        public BadRequestObjectResult(object error) : base(error)
        {
        }
    }

    public interface IActionResult<T> : IActionResult
	{
		
	}


    public class BooksFunction
	{

        [FunctionName("GetBooks")]
		public static IActionResult<IEnumerable<Book>> Books(
			[HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Books/All")]HttpRequest req, 
			ILogger log)
		{
            try{
			return new OkObjectResult<IEnumerable<Book>>(GetBookLogic().GetAllBooks());

            }
            catch(Exception e)
            {
                return new BadRequestObjectResult<IEnumerable<Book>>(e.ToString());
            }
		}

        [FunctionName("GetBookDetail")]
		public static IActionResult<Book> Details(
			[HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Book/{bookIDParam:int}/Detail")]HttpRequest req, 
			ILogger log,
			int bookIDParam)
		{
            if(bookIDParam == 0) { return new BadRequestObjectResult<Book>("Please fill the bookID"); }
			return new OkObjectResult<Book>(GetBookLogic().GetBookByID(bookIDParam));
		}

        [FunctionName("UpdateBookData")]
		public static IActionResult<bool> UpdateBookData(
			[HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "Book/{bookIDParam:int}/UpdateBookData")]Book input, 
			ILogger log,
			int bookIDParam)
		{
			//TODO: What happens when the id and the post object are different?
			//TODO: Validate input object 
			//input = UpdateBookDataInternal(input);			
			if(bookIDParam != input.BookID) { return new BadRequestObjectResult<bool>($"ID in post and url were not equal: {bookIDParam} vs {input.BookID}"); }
			log.LogWarning("Saving is disabled");
			//log.LogInformation($"Saving: {input.Title} with id {input.BookID}");
			return new OkObjectResult<bool>(true);
		}

		[FunctionName("UpdateReadStatus")]		
		public static IActionResult UpdateReadStatus(
			[HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "Book/{bookIDParam:int}/UpdateReadStatus")] BookReadStatusUpdateModel input,
			ILogger log,
			int bookIDParam)
		{
			//TODO: Validate input object 
			//UpdateReadStatusInternal(input.BookID, input.ReadStatus, input.ReadRemark);
			if(bookIDParam != input.BookID) { return new BadRequestObjectResult<bool>($"ID in post and url were not equal: {bookIDParam} vs {input.BookID}"); }
			log.LogWarning("Saving is disabled");
			log.LogInformation($"UpdateReadStatus: {input.ReadStatus} ({input.ReadRemark}) with id {input.BookID}");
			return new OkObjectResult(true);
		}

		
		[FunctionName("UpdateAvailabilityStatus")]		
		public static IActionResult<bool> UpdateAvailabilityStatus(
			[HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "Book/{bookIDParam:int}/UpdateAvailabilityStatus")] BookAvailabilityStatusUpdateModel input,
			ILogger log,
			int bookIDParam)
		{
			if(bookIDParam != input.BookID) { return new BadRequestObjectResult<bool>($"ID in post and url were not equal: {bookIDParam} vs {input.BookID}"); }
			//TODO: Validate input object 
			//UpdateAvailabilityStatusInternal(input.BookID, input.Status, input.StatusRemark);
			log.LogWarning("Saving is disabled");
			log.LogInformation($"UpdateAvailabilityStatus: {input.Status} ({input.StatusRemark}) with id {input.BookID}");
		
			return new OkObjectResult<bool>(true);
		}

    

     

	
		protected Book UpdateBookDataInternal(Book book)
		{
			//Merge new fields over the original book
			var bookOrig = GetBookLogic().GetBookByID(book.BookID.Value);
			bookOrig.Title = GetOverrideOrOriginal(bookOrig.Title, book.Title);
			bookOrig.Author = GetOverrideOrOriginal(bookOrig.Author, book.Author);
			bookOrig.Description = GetOverrideOrOriginal(bookOrig.Description, book.Description);
			bookOrig.Identifier = GetOverrideOrOriginal(bookOrig.Identifier, book.Identifier);
			bookOrig.Medium = GetOverrideOrOriginal(bookOrig.Medium, book.Medium);
			bookOrig.NrOfPages = GetOverrideOrOriginal(bookOrig.NrOfPages, book.NrOfPages);
			if(bookOrig.NrOfPages == 0) { book.NrOfPages = null; }
			//Save and continue
			GetBookLogic().Save(bookOrig);
			return bookOrig;
		}

		protected void UpdateReadStatusInternal(int bookID, string readStatus, string readRemark)
		{
			GetBookLogic().UpdateReadStatus(bookID, readStatus, readRemark);
		}

		protected void UpdateAvailabilityStatusInternal(int bookID, string bookStatus, string statusRemark)
		{
			GetBookLogic().UpdateAvailability(bookID, bookStatus, statusRemark);
		}

		//TODO: this could be done with generics, but for those whopping 5 max fields, nah
		private string GetOverrideOrOriginal(string originalData, string overrideData)
		{
			return !string.IsNullOrWhiteSpace(overrideData) ? overrideData : originalData;
		}

		private int? GetOverrideOrOriginal(int? originalData, int? overrideData)
		{
			return overrideData != null ? overrideData : originalData;
		}

        
        public static ePubAnalyzer.Shared.BLL.BookLogic GetBookLogic()
        {
            return GetLogicFactory().GetBookLogic();
        }

        //TODO: Isolate?

		private static ePubAnalyzer.Shared.BLL.LogicFactory GetLogicFactory()
		{
			return new ePubAnalyzer.Shared.BLL.LogicFactory(GetDALImplementation());
		}

        private static DALImplementation GetDALImplementation()
		{
			var cString = Environment.GetEnvironmentVariable("ConnectionStrings:DefaultConnection");
            Console.WriteLine($"Connecting with: {cString}");
			return new DALImplementation(cString);
		}

	}
}
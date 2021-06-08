using System.Collections.Generic;
using ePubAnalyzer.Shared.Entities;
using System.Threading.Tasks;
using System.Net.Http;
using ePubAnalyzer.Shared.API;
using System;
using Newtonsoft.Json;
using System.Net;

namespace ePubAnalyzer
{
    public class BookLogicApiHandler
	{
        private readonly string rootUrl;
        private readonly HttpClient httpClient;

        public BookLogicApiHandler(string rootUrl)
		{
			this.rootUrl = rootUrl + (rootUrl.EndsWith("/") ? "" : "/"); 
            
            //Ignore cert errors
            var cliHandler = new HttpClientHandler();
            cliHandler.ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => { return true; };
            this.httpClient = new HttpClient(cliHandler);
  
            httpClient.DefaultRequestHeaders.Add("User-Agent", "ePub catalog analyzer");
		}

		public async Task<IEnumerable<Book>> GetBooks()
		{
			return await ApiGet<IEnumerable<Book>>(HttpRoutes.GetBooksAll);
		}

		public async Task<Book> AddBook(Book book)
		{
			return await ApiPost<Book, Book>(HttpRoutes.AddBook, book);
        }

		public async Task<Book> UpdateBook(Book book)
		{
            string url = HttpRoutes.SetBookData.Replace("{bookIDParam:int}", $"{book.BookID}");
			return await ApiPost<Book, Book>(url, book);
        }

        private async Task<T> ApiGet<T>(string endPoint)
        {
            var fullUrl = rootUrl + endPoint;
            Console.Write($"Communicating to: {fullUrl}");

            var message = await httpClient.GetStringAsync(fullUrl);
            return JsonConvert.DeserializeObject<T>(message);
        }

        private async Task<T> ApiPost<T,TT>(string endPoint, TT data)
        {
            var fullUrl = rootUrl + endPoint;
            Console.Write($"Communicating to: {fullUrl}");

            string json = JsonConvert.SerializeObject(data);
            StringContent httpContent = new StringContent(json, System.Text.Encoding.UTF8, "application/json");
            
            var message = await (await httpClient.PostAsync(fullUrl, httpContent)).Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<T>(message);
        }
	}
}

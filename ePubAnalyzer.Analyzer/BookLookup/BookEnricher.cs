using System;
using System.IO;
using System.IO.Compression;
using System.Net.Http;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using EpubAnalyzer.Entities;

namespace EpubAnalyzer.BookLookup
{
	public class BookEnricher
	{
		private static readonly HttpClient _http = new HttpClient { Timeout = TimeSpan.FromSeconds(15) };
		private const int WordsPerPage = 250;

		public async Task EnrichAsync(EbookData book)
		{
			var isbn = book.BookDetail.Identifier;
			var filePath = Path.Combine(book.BookDetail.Folder ?? "", book.BookDetail.FileName ?? "");

			// Step 1: OPF description is already in Description if the book language is Dutch
			if (string.IsNullOrWhiteSpace(book.BookDetail.Description))
			{
				var lang = book.BookDetail.Language ?? "";
				var desc = book.BookDetail.Description;
				if (!string.IsNullOrWhiteSpace(desc) && lang.StartsWith("nl", StringComparison.OrdinalIgnoreCase))
					book.BookDetail.Description = desc;
			}

			// Step 2: Google Books API — Dutch description + page count
			if (!string.IsNullOrWhiteSpace(isbn))
			{
				try
				{
					var (gbDesc, gbPages) = await FetchGoogleBooksAsync(isbn);
					if (!string.IsNullOrWhiteSpace(gbDesc) && string.IsNullOrWhiteSpace(book.BookDetail.Description))
						book.BookDetail.Description = gbDesc;
					if (gbPages.HasValue && book.BookDetail.NrOfPages == null)
						book.BookDetail.NrOfPages = gbPages;
				}
				catch (Exception e)
				{
					Console.WriteLine($"  Google Books lookup failed for {isbn}: {e.Message}");
				}
			}

			// Step 3: Open Library fallback for page count
			if (book.BookDetail.NrOfPages == null && !string.IsNullOrWhiteSpace(isbn))
			{
				try
				{
					var olPages = await FetchOpenLibraryPageCountAsync(isbn);
					if (olPages.HasValue)
						book.BookDetail.NrOfPages = olPages;
				}
				catch (Exception e)
				{
					Console.WriteLine($"  Open Library lookup failed for {isbn}: {e.Message}");
				}
			}

			// Step 4: Estimate page count from epub word count
			if (book.BookDetail.NrOfPages == null)
			{
				var estimated = EstimatePageCount(filePath);
				if (estimated.HasValue)
				{
					book.BookDetail.NrOfPages = estimated;
					Console.WriteLine($"  Page count estimated from content: {estimated}");
				}
			}
		}

		private async Task<(string description, int? pageCount)> FetchGoogleBooksAsync(string isbn)
		{
			// langRestrict=nl biases results to Dutch editions when available
			var url = $"https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn}&langRestrict=nl";
			var json = await _http.GetStringAsync(url);
			using var doc = JsonDocument.Parse(json);
			var root = doc.RootElement;

			if (!root.TryGetProperty("items", out var items) || items.GetArrayLength() == 0)
			{
				// Retry without language restriction — book may be catalogued under another language
				url = $"https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn}";
				json = await _http.GetStringAsync(url);
				using var doc2 = JsonDocument.Parse(json);
				root = doc2.RootElement;
				if (!root.TryGetProperty("items", out items) || items.GetArrayLength() == 0)
					return (null, null);
			}

			var volumeInfo = items[0].GetProperty("volumeInfo");
			string description = volumeInfo.TryGetProperty("description", out var descEl) ? descEl.GetString() : null;
			int? pageCount = volumeInfo.TryGetProperty("pageCount", out var pagesEl) ? pagesEl.GetInt32() : null;

			return (description, pageCount);
		}

		private async Task<int?> FetchOpenLibraryPageCountAsync(string isbn)
		{
			var url = $"https://openlibrary.org/api/books?bibkeys=ISBN:{isbn}&format=json&jscmd=data";
			var json = await _http.GetStringAsync(url);
			using var doc = JsonDocument.Parse(json);
			var key = $"ISBN:{isbn}";
			if (!doc.RootElement.TryGetProperty(key, out var bookData))
				return null;
			if (bookData.TryGetProperty("number_of_pages", out var pagesEl))
				return pagesEl.GetInt32();
			return null;
		}

		private static int? EstimatePageCount(string epubFilePath)
		{
			try
			{
				if (!File.Exists(epubFilePath)) return null;
				int totalWords = 0;
				using var zip = ZipFile.OpenRead(epubFilePath);
				foreach (var entry in zip.Entries)
				{
					var name = entry.FullName;
					if (!name.EndsWith(".html", StringComparison.OrdinalIgnoreCase) &&
						!name.EndsWith(".xhtml", StringComparison.OrdinalIgnoreCase) &&
						!name.EndsWith(".htm", StringComparison.OrdinalIgnoreCase))
						continue;

					using var reader = new StreamReader(entry.Open());
					var content = reader.ReadToEnd();
					var text = Regex.Replace(content, "<[^>]+>", " ");
					totalWords += text.Split(new[] { ' ', '\t', '\n', '\r' }, StringSplitOptions.RemoveEmptyEntries).Length;
				}
				if (totalWords == 0) return null;
				return Math.Max(1, totalWords / WordsPerPage);
			}
			catch
			{
				return null;
			}
		}
	}
}

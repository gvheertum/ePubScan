using System;
using System.IO.Compression;
using System.Linq;
using System.Collections.Generic;
using System.Xml.Linq;
using System.IO;
using EpubAnalyzer.FileParsing;
using System.Text;
using EpubAnalyzer.Entities;

namespace ePubAnalyzer
{
    class Program
    {
		private const string TestEpubFolder = "/Users/gertjan/Desktop/ebooks/";
		private const string TestEpubOutput = "/Users/gertjan/Desktop/epub-output/";
        static void Main(string[] args)
        {
			if(args.Any(a => string.Equals("/test", a, StringComparison.OrdinalIgnoreCase)))
			{
				TestRun();
			}
			else 
			{
				MainOld(args);
			}
		}

		static void TestRun()
		{
			var x = new EpubAnalyzer.CatalogSync.CatalogSyncDatabaseSettingsRetriever().GetConnectionString();
			System.Console.WriteLine("Connection string: ");
			Console.WriteLine(x);
		}

		static void MainOld(string[] args)
		{
            Console.WriteLine("Epub data parser");
            Console.WriteLine("****************");
			
			Console.WriteLine("Default path: " + TestEpubFolder);
			Console.WriteLine("Folder (empty to keep default): ");
			var folderToUse = Console.ReadLine();
			System.Console.WriteLine($"User input: {folderToUse}");
			folderToUse = !string.IsNullOrWhiteSpace(folderToUse) ? folderToUse : TestEpubFolder;

			var files = new FolderScanner().GetEpubFilesFromFolder(folderToUse);
			System.Console.WriteLine($"Retrieved {files.Count} files");
			
			
			var parser = new EpubFileParser();
			var epubDetails = files.Select(f => parser.GetDataFromFile(f)).ToList();
			epubDetails.ForEach(dataC => 
			{
				var data = dataC.BookDetail;
				System.Console.WriteLine("--------------------------------");
				System.Console.WriteLine($"Filename: {data.FileName} ({data.Folder}) - ds: {dataC.DataSource}");
				System.Console.WriteLine($"Title: {data.Title}");
				System.Console.WriteLine($"Author: {data.Author}");
				System.Console.WriteLine($"Subject: {data.Subject}");
				System.Console.WriteLine($"Description: {data.Description}");
				System.Console.WriteLine($"Language: {data.Language}");
				//System.Console.WriteLine($"Date: {data.Date}");
				System.Console.WriteLine($"ISBN: {data.Identifier}");
			});

			Console.WriteLine("Default output path: " + TestEpubOutput);
			Console.WriteLine("Folder (empty to keep default): ");
			var folderToUseForOutput = Console.ReadLine();
			folderToUseForOutput = !string.IsNullOrWhiteSpace(folderToUseForOutput) ? folderToUseForOutput : TestEpubOutput;
			WriteOutputFile(epubDetails, folderToUseForOutput);
        }
//TODO: isolate writing logic
		private static void WriteOutputFile(IEnumerable<EbookData> data, string folder)
		{
			if(!System.IO.Directory.Exists(folder)) { System.IO.Directory.CreateDirectory(folder); }
			var di = new System.IO.DirectoryInfo(folder);
			string outputFile = di.FullName + "/" + DateTime.Now.ToString("yyyy-MM-dd") + ".html";
			System.Console.WriteLine($"Writing content to: {outputFile}");
			System.IO.File.WriteAllText(outputFile, GetTableContent(data));
		}

		private static string GetTableContent(IEnumerable<EbookData> data) 
		{
			StringBuilder sb = new StringBuilder();
			sb.Append("<html><body>");
			sb.Append("<table>");
			sb.Append(GenerateHeader());
			data.ToList().ForEach(d => sb.Append(GenerateLine(d)));
			sb.Append("</table>");
			sb.Append("</body></html>");
			return sb.ToString();
		}


		private static string GenerateHeader()
		{
			StringBuilder sb = new StringBuilder();
			sb.Append($"<tr>");
			sb.Append($"<th>Status</th>");
			sb.Append($"<th>Remark</th>");
			sb.Append($"<th>Title</th>");
			sb.Append($"<th>Author</th>");
			sb.Append($"<th>ISBN</th>");
			sb.Append($"<th>Language</th>");
			sb.Append($"<th>Category</th>");
			sb.Append($"<th>Subject</th>");
			sb.Append($"<th>Description</th>");
			sb.Append($"<th>Folder</th>");
			sb.Append($"<th>FileName</th>");
			sb.Append($"</tr>");
			return sb.ToString();
		}

		private static string GenerateLine(EbookData data) 
		{
			StringBuilder sb = new StringBuilder();
			sb.Append($"<tr>");
			sb.Append($"<td></td>");
			sb.Append($"<td></td>");
			sb.Append($"<td>{data.BookDetail.Title}</td>");
			sb.Append($"<td>{data.BookDetail.Author}</td>");
			sb.Append($"<td>{data.BookDetail.Identifier}</td>");
			sb.Append($"<td>{data.BookDetail.Language}</td>");
			sb.Append($"<td></td>");
			sb.Append($"<td>{data.BookDetail.Subject}</td>");
			sb.Append($"<td>{data.BookDetail.Description}</td>");
			sb.Append($"<td>{data.BookDetail.Folder}</td>");
			sb.Append($"<td>{data.BookDetail.FileName}</td>");
			sb.Append($"</tr>");
			return sb.ToString();
		}
    }	
}

using System;
using System.IO.Compression;
using System.Linq;
using System.Collections.Generic;
using System.Xml.Linq;
using System.IO;
using EpubAnalyzer.FileParsing;
using System.Text;
using EpubAnalyzer.Entities;

namespace EpubAnalyzer
{
    class Program
    {
		private const string TestEpubFolder = "/Users/gertjan/Desktop/epubtest/";
		private const string TestEpubOutput = "/Users/gertjan/Desktop/epub-output/";
        static void Main(string[] args)
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
			epubDetails.ForEach(data => 
			{
				System.Console.WriteLine("--------------------------------");
				System.Console.WriteLine($"Filename: {data.FileName} ({data.Folder}) - ds: {data.DataSource}");
				System.Console.WriteLine($"Title: {data.Title}");
				System.Console.WriteLine($"Author: {data.Author}");
				System.Console.WriteLine($"Subject: {data.Subject}");
				System.Console.WriteLine($"Description: {data.Description}");
				System.Console.WriteLine($"Language: {data.Language}");
				System.Console.WriteLine($"Date: {data.Date}");
				System.Console.WriteLine($"ISBN: {data.ISBN}");
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
			sb.Append($"<th>ISBN</th>");
			sb.Append($"<th>Title</th>");
			sb.Append($"<th>Author</th>");
			sb.Append($"<th>Language</th>");
			sb.Append($"<th>Subject</th>");
			sb.Append($"<th>Description</th>");
			sb.Append($"<th>Date</th>");
			sb.Append($"<th>Folder</th>");
			sb.Append($"<th>FileName</th>");
			sb.Append($"</tr>");
			return sb.ToString();
		}

		private static string GenerateLine(EbookData data) 
		{
			StringBuilder sb = new StringBuilder();
			sb.Append($"<tr>");
			sb.Append($"<td>{data.ISBN}</td>");
			sb.Append($"<td>{data.Title}</td>");
			sb.Append($"<td>{data.Author}</td>");
			sb.Append($"<td>{data.Language}</td>");
			sb.Append($"<td>{data.Subject}</td>");
			sb.Append($"<td>{data.Description}</td>");
			sb.Append($"<td>{data.Date}</td>");
			sb.Append($"<td>{data.Folder}</td>");
			sb.Append($"<td>{data.FileName}</td>");
			sb.Append($"</tr>");
			return sb.ToString();
		}
    }	
}

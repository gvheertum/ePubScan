using System;
using System.IO.Compression;
using System.Linq;
using System.Collections.Generic;
using System.Xml.Linq;
using System.IO;
using EpubAnalyzer.FileParsing;
using EpubAnalyzer.Entities;
using System.Threading.Tasks;

namespace ePubAnalyzer
{
    class Program
    {
		private const string TestEpubFolder = "/Users/gertjan/Desktop/ebooks/ToCatalog/";
		private const string TestEpubOutput = "/Users/gertjan/Desktop/epub-output/";

        static async Task Main(string[] args)
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
			
			//Read and parse files
			var parser = new EpubFileParser();
			var epubDetails = files.Select(f => parser.GetDataFromFile(f)).ToList();
			
			EchoToOutput(epubDetails);
			
			if(AskConfirmOnAction("Perform database actions?"))
			{
				var compareHelper = new DatabaseComparisonHelper(new BookLogicApiHandler(Secrets.ApiLocation));
				var compareResults = compareHelper.CompareSetWithDatabase(epubDetails);
				compareHelper.EchoComparisonSetDetails(compareResults);
				
				//Check if we want and need to take action to save new and/or existing items
				if(compareResults.NewItems.Any() && AskConfirmOnAction("Store new books to database?"))
				{
					await compareHelper.SaveNewItems(compareResults);
				}

				if(compareResults.ExistingItems.Any() && AskConfirmOnAction("Overwrite existing books to database?"))
				{
					await compareHelper.SaveExistingItems(compareResults);
				}
			}
			//if(AskConfirmOnAction("Write output file?")) { WriteOutputFile(epubDetails); }			
        }

		private static bool AskConfirmOnAction(string request)
		{
			int reqCnt = 0;
			while(reqCnt < 3)
			{
				System.Console.WriteLine($"{request} (y/n)");
				var r = System.Console.ReadLine();
				if(string.Equals(r, "Y", StringComparison.OrdinalIgnoreCase)) { return true; }
				if(string.Equals(r, "N", StringComparison.OrdinalIgnoreCase)) { return false; }
				reqCnt++;
			}
			System.Console.WriteLine("Question threshold exceded, returning N");
			return false;
		}

		private static void EchoToOutput(IEnumerable<EbookData> datas)
		{
			datas.ToList().ForEach(dataC => 
			{
				var data = dataC.BookDetail;
				System.Console.WriteLine("--------------------------------");
				System.Console.WriteLine($"Filename: {data.FileName} ({data.Folder}) - ds: {dataC.DataSource}");
				System.Console.WriteLine($"Title: {data.Title}");
				System.Console.WriteLine($"Author: {data.Author}");
				System.Console.WriteLine($"Subject: {data.Subject}");
				System.Console.WriteLine($"Description: {data.Description}");
				System.Console.WriteLine($"Language: {data.Language}");
				System.Console.WriteLine($"ISBN: {data.Identifier}");
			});
		}

		private static void WriteOutputFile(IEnumerable<EbookData> data)
		{
			Console.WriteLine("Default output path: " + TestEpubOutput);
			Console.WriteLine("Folder (empty to keep default): ");
			var folder = Console.ReadLine();
			folder = !string.IsNullOrWhiteSpace(folder) ? folder : TestEpubOutput;

			new OutputHtmlWriter().WriteOutputHtml(folder, data);
		}
    }	
}

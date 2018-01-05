using System;
using System.IO.Compression;
using System.Linq;
using System.Collections.Generic;
using System.Xml.Linq;
using System.IO;
using EpubAnalyzer.FileParsing;

namespace EpubAnalyzer
{
    class Program
    {
		private const string TestEpubFolder = "/Users/gertjan/Desktop/epubtest/";
        static void Main(string[] args)
        {

            Console.WriteLine("Epub data parser");
            Console.WriteLine("****************");
			
			Console.WriteLine("Default path: " + TestEpubFolder);
			Console.WriteLine("Folder (empty to keep default): ");
			var folderToUse = Console.ReadLine();
			folderToUse = !string.IsNullOrWhiteSpace(folderToUse) ? TestEpubFolder : folderToUse;

			var files = new FolderScanner().GetEpubFilesFromFolder(TestEpubFolder);
			System.Console.WriteLine($"Retrieved {files.Count} files");
			
			
			var parser = new EpubFileParser();
			var epubDetails = files.Select(f => parser.GetDataFromFile(f)).ToList();
			epubDetails.ForEach(data => 
			{
				System.Console.WriteLine("--------------------------------");
				System.Console.WriteLine($"Filename: {data.FileName} (@ {data.Folder})");
				System.Console.WriteLine($"Title: {data.Title}");
				System.Console.WriteLine($"ISBN: {data.ISBN}");
			});
        }
    }	
}

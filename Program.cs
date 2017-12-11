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
            Console.WriteLine("Hello World!");
			var files = new FolderScanner().GetEpubFilesFromFolder(TestEpubFolder);
			files.ForEach(f => 
			{
				var data = new EpubFileParser().GetDataFromFile(f);
				System.Console.WriteLine($"Filename: {data.FileName}");
				System.Console.WriteLine("--------------------------------");
				System.Console.WriteLine($"Title: {data.Title}");
				System.Console.WriteLine($"ISBN: {data.ISBN}");
				System.Console.WriteLine();
			});
        }
    }	
}

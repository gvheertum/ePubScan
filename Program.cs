using System;
using System.IO.Compression;

namespace EpubAnalyzer
{
    class Program
    {
		private const string TestEpubFile = "/Users/gertjan/Desktop/test.epub";
        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");
			new Program().TestZip(TestEpubFile);
        }

		private void TestZip(string file)
		{
			if(!System.IO.File.Exists(file)) { throw new Exception("Invalid file"); }
			using(var za = ZipFile.Open(file, ZipArchiveMode.Read))
			{
				foreach(var x in za.Entries)
				{
					System.Console.WriteLine($":{x.FullName} ({x.Length})");
				}
			}
		}
    }
}

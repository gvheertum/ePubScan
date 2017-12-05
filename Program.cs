using System;
using System.IO.Compression;

namespace EpubAnalyzer
{
    class Program
    {
		private const string TestEpubFile = "/Users/gertjan/Desktop/epubtest/test2.epub";
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
					if(x.FullName.EndsWith(".xml") || x.FullName.EndsWith("ncx"))
					{
						using(var s = new System.IO.StreamReader(x.Open()))
						{
							var res = s.ReadToEnd();
							System.Console.WriteLine("!");
							System.Console.WriteLine(res);
							// var d = new byte[s.Length];
							// s.Read(d,0,(int)s.Length);
							// var content = System.Text.UTF8Encoding.UTF8.GetString(d,0,d.Length);
							// System.Console.WriteLine(content);
						}
					}
				}
			}
		}
    }
}

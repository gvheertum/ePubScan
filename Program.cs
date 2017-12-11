using System;
using System.IO.Compression;
using System.Linq;
using System.Collections.Generic;
using System.Xml.Linq;
using System.IO;

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

	public class FolderScanner
	{
		public List<string> GetEpubFilesFromFolder(string folder)
		{
			var di = new System.IO.DirectoryInfo(folder);
			return di.GetFileSystemInfos().Where(fi => fi.Extension == ".epub").Select(fi => fi.FullName).ToList();
		}
	}

	public class EpubData
	{
		public string FileName {get;set;}
		public string ISBN {get;set;}
		public string Title {get;set;}
	}
	public class EpubFileParser
	{
		public EpubData GetDataFromFile(string file)
		{
			var dataStr = GetRelevantFileContentEpubFile(file);
			var dataXml = ParseDesciptorFile(dataStr);
			return new EpubData()
			{
				FileName = file,
				ISBN = GetISBNFromFile(dataXml),
				Title = GetTitleFromFile(dataXml)
			};
		}
	
		private string GetRelevantFileContentEpubFile(string file)
		{
			if(!System.IO.File.Exists(file)) { throw new Exception("Invalid file"); }
			using(var za = ZipFile.Open(file, ZipArchiveMode.Read))
			{
				foreach(var x in za.Entries)
				{
					if(x.FullName.EndsWith("ncx"))
					{
						using(var s = new System.IO.StreamReader(x.Open()))
						{
							var res = s.ReadToEnd();
							return res;
						}
					}
				}
			}
			throw new Exception("Could not find a ncx file");
		}

		private XDocument ParseDesciptorFile(string fileContent)
		{
			var d = XDocument.Load(new StringReader(fileContent));
			return d;
		}
/*
<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE ncx PUBLIC "-//NISO//DTD ncx 2005-1//EN" "http://www.daisy.org/z3986/2005/ncx-2005-1.dtd">
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" xml:lang="nl" version="2005-1">
<head>
    <meta name="dtb:uid" content="978-90-263-3542-6"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>

  <docTitle>
    <text>Niks</text>
  </docTitle>

 */
		private string GetISBNFromFile(XDocument document)
		{
			// root/head/ dtb:uid
			var headTag = document.Descendants().First(d => d.Name.LocalName == "head");
			var uidTag = headTag.Descendants().First(d => d.Name.LocalName == "meta" && d.Attributes("name").FirstOrDefault()?.Value == "dtb:uid");
			return uidTag?.Attributes("content").FirstOrDefault()?.Value?.Replace("-", "").Replace(" ", "") ?? "No UID";
		}

		private string GetTitleFromFile(XDocument document)
		{
			// root/doctitle
			var docTitleTag = document.Descendants().First(d => d.Name.LocalName == "docTitle");
			return docTitleTag?.Value ?? "No title";
		}
	}

	public interface ICodeScanner
	{

	}

	public class CodeScannerAko : ICodeScanner
	{
			//http://www.ako.nl/product/{ISBN}/
	}
	public class CodeScannerBlz : ICodeScanner
	{
		//https://www.blz.nl/boek/9789026332401 --> redir to
		//https://www.blz.nl/boek/?authortitle=holly-seddon/hou-je-adem-in--9789026332401
	}
}

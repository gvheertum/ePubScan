using System;
using System.IO.Compression;
using System.Linq;
using System.Collections.Generic;
using System.Xml.Linq;
using System.IO;
using EpubAnalyzer.Entities;

namespace EpubAnalyzer.FileParsing
{
	public class EpubFileParser
	{
		public EbookData GetDataFromFile(string file)
		{
			var dataStr = GetRelevantFileContentEpubFile(file);
			var dataXml = ParseDesciptorFile(dataStr);
			return new EbookData()
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
}
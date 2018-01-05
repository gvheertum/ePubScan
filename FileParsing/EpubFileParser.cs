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
		public const string FileExtensionForMetaDataAlternate = "ncx";
		public const string FileExtensionForMetaData = "opf";
		public EbookData GetDataFromFile(string file)
		{
			FileInfo fi = new FileInfo(file);
			var opfContent = GetRelevantFileContentEpubFile(file, FileExtensionForMetaData);
			var ncxContent = GetRelevantFileContentEpubFile(file, FileExtensionForMetaDataAlternate);
			
			EbookData data = null;
			if(!string.IsNullOrWhiteSpace(opfContent)) { data = TryReadingFromOpf(opfContent, fi); }
			if(!string.IsNullOrWhiteSpace(ncxContent)) { data = TryReadingFromNcx(ncxContent, fi); }
			if(data == null) { throw new Exception($"Cannot read data from OPF and NCX for {fi.Name}"); }

			return data;
		}

		private EbookData TryReadingFromOpf(string fileContent, FileInfo fileInfo)
		{
			try
			{
				throw new Exception("OPF not implemented");
			}
			catch(Exception e)
			{
				Console.WriteLine($"Cannot parse opf: {e.Message}");
				return null;
			}
		}

		private EbookData TryReadingFromNcx(string fileContent, FileInfo fileInfo)
		{
			try
			{
				var dataXml = ParseDesciptorFileNcx(fileContent);
		
				return new EbookData()
				{
					Folder = fileInfo.DirectoryName,
					FileName = fileInfo.Name,
					ISBN = GetISBNFromFile(dataXml),
					Title = GetTitleFromFile(dataXml)
				};
			}
			catch(Exception e)
			{
				System.Console.WriteLine($"Cannot read ncx data: {e.Message}");
				return null;
			}
		}
	
		private string GetRelevantFileContentEpubFile(string file, string fileSuffixToSearch)
		{
			if(!System.IO.File.Exists(file)) { throw new Exception("Invalid epub file"); }
			using(var za = ZipFile.Open(file, ZipArchiveMode.Read))
			{
				var metaDataFile = za.Entries.FirstOrDefault(e => e.FullName.EndsWith(fileSuffixToSearch));
				if(metaDataFile != null)
				{
					using(var s = new System.IO.StreamReader(metaDataFile.Open()))
					{
						var res = s.ReadToEnd();
						return res;
					}
				}
			}
			return null;
		}

		private XDocument ParseDesciptorFileNcx(string fileContent)
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
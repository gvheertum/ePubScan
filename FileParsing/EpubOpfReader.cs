using System;
using System.IO;
using System.Linq;
using System.Xml.Linq;
using EpubAnalyzer.Entities;

namespace EpubAnalyzer.FileParsing
{
	public class EpubOpfReader : EpubReaderBase
	{
		protected override string FileMaskToSearch => "opf";

		protected override EbookData GetDataInternal(string fileContent, FileInfo fileInfo)
		{
			var xDoc = ParseDesciptorFile(fileContent);
			return new EbookData() 
			{
				Title = GetTitle(xDoc),
				Author = GetAuthor(xDoc),
				ISBN = GetISBN(xDoc),
				FileName = fileInfo.Name,
				Folder = fileInfo.DirectoryName,
				DataSource = "opf"
			};
		}
		/* 
			<metadata>
				<dc:title/>
				<dc:creator/>
				<dc:identifier/>
			</metadata> 
		*/
		private string GetTitle(XDocument xDoc) 
		{
			var tag = GetMetadataTag(xDoc).Descendants().First(d => d.Name.LocalName == "title");
			return tag.Value;
		}

		private string GetISBN(XDocument xDoc) 
		{
			var tag = GetMetadataTag(xDoc).Descendants().First(d => d.Name.LocalName == "identifier");
			return tag.Value;
		}

		private string GetAuthor(XDocument xDoc)
		{
			var tag = GetMetadataTag(xDoc).Descendants().First(d => d.Name.LocalName == "creator");
			return tag.Value;
		}

		private XElement GetMetadataTag(XDocument xDoc)
		{
			return xDoc.Descendants().First(d => d.Name.LocalName == "metadata");
		}
	}
}
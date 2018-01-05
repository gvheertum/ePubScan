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
				Date = GetDate(xDoc),
				Description = GetDescription(xDoc),
				Subject = GetSubject(xDoc),
				Language = GetLanguage(xDoc),
				DataSource = "opf"
			};
		}

		private string GetTitle(XDocument xDoc) 
		{
			return GetValueOfChild(GetMetadataTag(xDoc), "title");
		}

		private string GetISBN(XDocument xDoc) 
		{
			return GetValueOfChild(GetMetadataTag(xDoc), "identifier")?.Replace("-","").Replace(" ", "");
		}

		private string GetAuthor(XDocument xDoc)
		{
			return GetValueOfChild(GetMetadataTag(xDoc), "creator");
		}

		private string GetLanguage(XDocument xDoc)
		{
			return GetValueOfChild(GetMetadataTag(xDoc), "language");
		}

		private string GetDescription(XDocument xDoc)
		{
			return GetValueOfChild(GetMetadataTag(xDoc), "description");
		}

		private string GetSubject(XDocument xDoc)
		{
			return GetValueOfChild(GetMetadataTag(xDoc), "subject");
		}

		private string GetDate(XDocument xDoc)
		{
			return GetValueOfChild(GetMetadataTag(xDoc), "date");
		}
	
		private XElement GetMetadataTag(XDocument xDoc)
		{
			var tag = xDoc.Descendants().First(d => d.Name.LocalName == "metadata");
			return tag;
		}

		private string GetValueOfChild(XElement xEl, string elementName)
		{
			var tag = xEl.Descendants().FirstOrDefault(d => d.Name.LocalName == elementName);
			return tag?.Value;

		}
	}
}
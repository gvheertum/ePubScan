using System.Linq;
using System.Xml.Linq;
using System.IO;
using EpubAnalyzer.Entities;

namespace EpubAnalyzer.FileParsing
{
	public class EpubNcxReader : EpubReaderBase
	{
		protected override string FileMaskToSearch => "ncx";

		protected override EbookData GetDataInternal(string fileContent, FileInfo fileInfo)
		{
			var dataXml = ParseDesciptorFile(fileContent);
	
			return new EbookData()
			{
				BookDetail = new ePubAnalyzer.Shared.Entities.Book()
				{
					Folder = fileInfo.DirectoryName,
					FileName = fileInfo.Name,
					Identifier = GetISBNFromFile(dataXml),
					Title = GetTitleFromFile(dataXml),
				},
				DataSource = "opf"
			};
		}

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
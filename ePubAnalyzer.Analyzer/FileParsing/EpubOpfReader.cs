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
				BookDetail = new ePubAnalyzer.Shared.Entities.Book()
				{
					Title = GetTitle(xDoc),
					Author = GetAuthor(xDoc),
					Identifier = GetISBN(xDoc),
					FileName = fileInfo.Name,
					Folder = fileInfo.DirectoryName,
					//Date = GetDate(xDoc),
					Description = GetDescription(xDoc),
					Subject = GetSubject(xDoc),
					Language = GetLanguage(xDoc),
					NrOfPages = GetPageCount(xDoc),
				},
				DataSource = "opf"
			};
		}

		private int? GetPageCount(XDocument xDoc)
		{
			var metadata = GetMetadataTag(xDoc);

			// EPUB3: <meta property="schema:numberOfPages">320</meta>
			var schemaPages = metadata.Descendants()
				.FirstOrDefault(d => d.Name.LocalName == "meta" &&
					d.Attributes().Any(a => a.Name.LocalName == "property" && a.Value == "schema:numberOfPages"));
			if (schemaPages != null && int.TryParse(schemaPages.Value?.Trim(), out var n1)) return n1;

			// EPUB2/Calibre: <meta name="pageCount" content="320"/> or calibre:pagecount
			var namedMeta = metadata.Descendants()
				.FirstOrDefault(d => d.Name.LocalName == "meta" &&
					d.Attributes().Any(a => a.Name.LocalName == "name" &&
						(a.Value == "pageCount" || a.Value == "calibre:pagecount")));
			if (namedMeta != null)
			{
				var content = namedMeta.Attribute("content")?.Value;
				if (int.TryParse(content, out var n2)) return n2;
			}

			return null;
		}

		private string GetTitle(XDocument xDoc) 
		{
			return GetValueOfChild(GetMetadataTag(xDoc), "title");
		}

		private string GetISBN(XDocument xDoc)
		{
			var metadata = GetMetadataTag(xDoc);
			var identifiers = metadata.Descendants()
				.Where(d => d.Name.LocalName == "identifier")
				.ToList();

			// 1. Explicit scheme attribute: opf:scheme="ISBN" or scheme="ISBN"
			var byScheme = identifiers.FirstOrDefault(id =>
				id.Attributes().Any(a =>
					a.Name.LocalName == "scheme" &&
					string.Equals(a.Value, "ISBN", StringComparison.OrdinalIgnoreCase)));
			if (byScheme != null)
				return CleanIsbn(byScheme.Value);

			// 2. urn:isbn: or isbn: URI prefix
			var byUrn = identifiers.FirstOrDefault(id =>
				id.Value.StartsWith("urn:isbn:", StringComparison.OrdinalIgnoreCase) ||
				id.Value.StartsWith("isbn:", StringComparison.OrdinalIgnoreCase));
			if (byUrn != null)
				return CleanIsbn(byUrn.Value.Substring(byUrn.Value.LastIndexOf(':') + 1));

			// 3. Calibre stores ISBN in <meta name="calibre:isbn" content="...">
			var calibreMeta = metadata.Descendants()
				.FirstOrDefault(d =>
					d.Name.LocalName == "meta" &&
					d.Attributes().Any(a => a.Name.LocalName == "name" && a.Value == "calibre:isbn"));
			if (calibreMeta != null)
			{
				var content = calibreMeta.Attribute("content")?.Value;
				if (!string.IsNullOrWhiteSpace(content))
					return CleanIsbn(content);
			}

			// 4. Last resort: pattern-match any identifier that looks like ISBN-10 or ISBN-13
			foreach (var id in identifiers)
			{
				var cleaned = CleanIsbn(id.Value);
				if (LooksLikeIsbn(cleaned))
					return cleaned;
			}

			return null;
		}

		private static string CleanIsbn(string raw) =>
			raw?.Replace("-", "").Replace(" ", "").Trim();

		private static bool LooksLikeIsbn(string s)
		{
			if (string.IsNullOrWhiteSpace(s)) return false;
			if (s.Length == 13 && s.All(char.IsDigit)) return true;
			if (s.Length == 10 && s[..9].All(char.IsDigit) && (char.IsDigit(s[9]) || s[9] == 'X' || s[9] == 'x')) return true;
			return false;
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
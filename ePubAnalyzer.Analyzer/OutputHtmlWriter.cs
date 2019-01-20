using System;
using System.Linq;
using System.Collections.Generic;
using System.Text;
using EpubAnalyzer.Entities;

namespace ePubAnalyzer
{
	public class OutputHtmlWriter
	{
		public void WriteOutputHtml(string folder, IEnumerable<EbookData> data)
		{
			if(!System.IO.Directory.Exists(folder)) { System.IO.Directory.CreateDirectory(folder); }
			var di = new System.IO.DirectoryInfo(folder);
			string outputFile = di.FullName + "/" + DateTime.Now.ToString("yyyy-MM-dd") + ".html";
			System.Console.WriteLine($"Writing content to: {outputFile}");
			System.IO.File.WriteAllText(outputFile, GetTableContent(data));
		}

		private string GetTableContent(IEnumerable<EbookData> data) 
		{
			StringBuilder sb = new StringBuilder();
			sb.Append("<html><body>");
			sb.Append("<table>");
			sb.Append(GenerateHeader());
			data.ToList().ForEach(d => sb.Append(GenerateLine(d)));
			sb.Append("</table>");
			sb.Append("</body></html>");
			return sb.ToString();
		}


		private string GenerateHeader()
		{
			StringBuilder sb = new StringBuilder();
			sb.Append($"<tr>");
			sb.Append($"<th>Status</th>");
			sb.Append($"<th>Remark</th>");
			sb.Append($"<th>Title</th>");
			sb.Append($"<th>Author</th>");
			sb.Append($"<th>ISBN</th>");
			sb.Append($"<th>Language</th>");
			sb.Append($"<th>Category</th>");
			sb.Append($"<th>Subject</th>");
			sb.Append($"<th>Description</th>");
			sb.Append($"<th>Folder</th>");
			sb.Append($"<th>FileName</th>");
			sb.Append($"</tr>");
			return sb.ToString();
		}

		private string GenerateLine(EbookData data) 
		{
			StringBuilder sb = new StringBuilder();
			sb.Append($"<tr>");
			sb.Append($"<td></td>");
			sb.Append($"<td></td>");
			sb.Append($"<td>{data.BookDetail.Title}</td>");
			sb.Append($"<td>{data.BookDetail.Author}</td>");
			sb.Append($"<td>{data.BookDetail.Identifier}</td>");
			sb.Append($"<td>{data.BookDetail.Language}</td>");
			sb.Append($"<td></td>");
			sb.Append($"<td>{data.BookDetail.Subject}</td>");
			sb.Append($"<td>{data.BookDetail.Description}</td>");
			sb.Append($"<td>{data.BookDetail.Folder}</td>");
			sb.Append($"<td>{data.BookDetail.FileName}</td>");
			sb.Append($"</tr>");
			return sb.ToString();
		}
	}
}

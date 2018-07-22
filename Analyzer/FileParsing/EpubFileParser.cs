using System;
using System.Collections.Generic;
using System.IO;
using EpubAnalyzer.Entities;

namespace EpubAnalyzer.FileParsing
{
	public class EpubFileParser
	{
		
		public EbookData GetDataFromFile(string file)
		{
			FileInfo fi = new FileInfo(file);
			EbookData data = new EpubOpfReader().GetData(fi) ?? new EpubNcxReader().GetData(fi);
			if(data!=null)
			{
				data.BookDetail.Medium = "ebook";
				data.BookDetail.Status = "N/A";
				data.BookDetail.StatusRemark = "Not applicable, is ebook";
			}
			return data ?? throw new Exception($"Cannot read data from OPF and NCX for {fi.Name}");;
		}

	}
}
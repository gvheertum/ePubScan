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
			return data ?? throw new Exception($"Cannot read data from OPF and NCX for {fi.Name}");;
		}

	}
}
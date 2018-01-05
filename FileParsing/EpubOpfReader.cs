using System;
using System.IO;
using EpubAnalyzer.Entities;

namespace EpubAnalyzer.FileParsing
{
	public class EpubOpfReader : EpubReaderBase
	{
		protected override string FileMaskToSearch => "opf";

		protected override EbookData GetDataInternal(string fileContent, FileInfo fileInfo)
		{
			throw new Exception("Not implemented");
		}
	}
}
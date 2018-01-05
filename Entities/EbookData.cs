using System;
using System.IO.Compression;
using System.Linq;
using System.Collections.Generic;
using System.Xml.Linq;
using System.IO;

namespace EpubAnalyzer.Entities
{
	public class EbookData
	{
		public string FileName {get;set;}
		public string Folder {get;set;}
		public string ISBN {get;set;}
		public string Title {get;set;}
		public List<ExternalDescription> ExternalData {get;set;} = new List<ExternalDescription>();
	}
}
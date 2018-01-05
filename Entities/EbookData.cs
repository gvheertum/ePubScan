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
		public string Author {get;set;}
		public string Date {get;set;}
		public string Language {get;set;}
		public string Description {get;set;}
		public string Subject {get;set;}
		public string DataSource {get;set;}
		public List<ExternalDescription> ExternalData {get;set;} = new List<ExternalDescription>();
		public bool IsUsable()
		{
			return !string.IsNullOrWhiteSpace(Title); //TODO: Add additional checks?
		}
	}
}
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
		private ePubAnalyzer.Shared.Entities.Book _bookDetail;
		public ePubAnalyzer.Shared.Entities.Book BookDetail 
		{
			get { return _bookDetail = _bookDetail ?? new ePubAnalyzer.Shared.Entities.Book(); }
			set { _bookDetail = value; } 
		}

		public string DataSource {get;set;}
		public List<ExternalDescription> ExternalData {get; set; } = new List<ExternalDescription>();
		public bool IsUsable()
		{
			return !string.IsNullOrWhiteSpace(BookDetail?.Title); //TODO: Add additional checks?
		}
	}
}
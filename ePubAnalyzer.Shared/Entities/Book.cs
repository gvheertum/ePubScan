namespace ePubAnalyzer.Shared.Entities
{
	public class Book
	{
		public int? BookID {get;set;}
		public string ReadStatus {get;set;}
		public string ReadRemark {get;set;}
		public string Identifier {get;set;}
		public string Title {get;set;}
		public string Author {get;set;}
		public string Category {get;set;}
		public string Subject {get;set;}
		public string Description {get;set;}
		public string Language {get;set;}
		public string Folder {get;set;}
		public string FileName {get;set;}
		public string Medium {get;set;}
		//Available, or lend to somebody
		public string Status {get;set;}
		//Remark applicable when lend to somebody
		public string StatusRemark {get;set;}
		public int? NrOfPages {get;set;}
		public override string ToString()
		{
			return $"{Author} - {Title} (identifier: {Identifier}, bookID: {BookID})";
		}
	}
}
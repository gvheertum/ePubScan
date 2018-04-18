namespace ePubAnalyzer.Shared.Entities
{
	public class ComparisonObject<T> where T : class
	{
		public ComparisonResult Result {get;set;}
		public T Element {get;set;}
	}
}
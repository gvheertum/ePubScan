using System.Collections.Generic;
using System.Linq;

namespace ePubAnalyzer.Shared.Entities
{
	public class ComparisonContainer<T> where T : class
	{
		public ComparisonContainer(IEnumerable<ComparisonObject<T>> items)
		{
			NewItems = items.Where(i => i.Result == ComparisonResult.New).Select(i => i.Element).ToList();
			RemovedItems = items.Where(i => i.Result == ComparisonResult.Removed).Select(i => i.Element).ToList();
			ExistingItems = items.Where(i => i.Result == ComparisonResult.Existing).Select(i => i.Element).ToList();
		}
		
		public IEnumerable<T> NewItems { get; set; }
		public IEnumerable<T> RemovedItems { get; set; }
		public IEnumerable<T> ExistingItems {get;set;}
	}
}
using System.Collections.Generic;
using EpubAnalyzer.Entities;
using ePubAnalyzer.Shared.Entities;
using System.Threading.Tasks;

namespace ePubAnalyzer.ComparisonHelper
{
    public abstract class DatabaseComparisonHelperBase
	{
		public abstract ComparisonContainer<Book> CompareSetWithDatabase(IEnumerable<EbookData> books);
		public abstract void EchoComparisonSetDetails(ComparisonContainer<Book> container);
		public abstract Task SaveNewItems(ComparisonContainer<Book> container);
		public abstract Task SaveExistingItems(ComparisonContainer<Book> container);


	}
}

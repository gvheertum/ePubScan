using System.Collections.Generic;
using ePubAnalyzer.Shared.Entities;
using System.Threading.Tasks;

namespace ePubAnalyzer.Shared.ComparisonHelper
{
    public abstract class DatabaseComparisonHelperBase
	{
		public abstract void EchoComparisonSetDetails(ComparisonContainer<Book> container);
		public abstract Task SaveNewItems(ComparisonContainer<Book> container);
		public abstract Task SaveExistingItems(ComparisonContainer<Book> container);
		public abstract ComparisonContainer<Book> GetComparisonContainer(IEnumerable<Book> existingBooks, IEnumerable<Book> newBooks);
	}
}

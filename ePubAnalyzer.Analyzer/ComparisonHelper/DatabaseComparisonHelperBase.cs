using System.Collections.Generic;
using EpubAnalyzer.Entities;
using ePubAnalyzer.Shared.Entities;
using System.Threading.Tasks;

namespace ePubAnalyzer.ComparisonHelper
{
    public abstract class DatabaseComparisonHelperBase : ePubAnalyzer.Shared.ComparisonHelper.DatabaseComparisonHelperBase
	{
		public abstract ComparisonContainer<Book> CompareSetWithDatabase(IEnumerable<EbookData> books);
	}
}


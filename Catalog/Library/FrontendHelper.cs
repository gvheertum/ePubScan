using ePubAnalyzer.Shared.DAL;
using Library.DAL;

namespace Library
{
	public class FrontendHelper
	{
		private IDAL GetDALInstance()
		{
			return new CatalogDALCreator().GetDALImplementation();
		}

		public ePubAnalyzer.Shared.BLL.LogicFactory GetLogicFactory()
		{
			return new ePubAnalyzer.Shared.BLL.LogicFactory(GetDALInstance());
		}
	}
}
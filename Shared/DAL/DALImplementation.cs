using System;

namespace ePubAnalyzer.Shared.DAL
{
	public class DALImplementation : IDAL
	{
		private readonly string _connectionString;

		public DALImplementation(string connectionString)
		{
			_connectionString = connectionString;
		}
		BookRepository IDAL.GetBookRepository()
		{
			return new BookRepository(GetContextCreator());
		}

		private Func<EpubCatalogContext> GetContextCreator()
		{
			return () => new EpubCatalogContext(EpubCatalogContext.GetConfig(_connectionString));
		}
	}
}
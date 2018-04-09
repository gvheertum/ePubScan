namespace ePubAnalyzer.Shared.BLL
{
	public class LogicFactory
	{
		private DAL.IDAL _dal;

		public LogicFactory(DAL.IDAL dal)
		{
			_dal = dal;
		}

		public BookLogic GetBookLogic()
		{
			return new BookLogic(_dal);
		}
	}
}
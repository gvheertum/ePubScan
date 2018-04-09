using ePubAnalyzer.Shared.DAL;

namespace ePubAnalyzer.Shared.BLL
{
	public abstract class LogicBase
	{
		protected IDAL _dal;

		protected LogicBase(DAL.IDAL dal)
		{
			_dal = dal;
		}
	}
}
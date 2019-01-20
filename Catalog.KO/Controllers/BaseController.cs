using Library;
using Microsoft.AspNetCore.Mvc;

namespace Catalog.Controllers
{
	public abstract class BaseController : Controller
	{
		private FrontendHelper _fh;
		protected FrontendHelper GetFrontendHelper()
		{
			return _fh = _fh ?? new FrontendHelper();
		}
	}
}

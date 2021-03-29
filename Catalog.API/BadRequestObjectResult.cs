using Microsoft.AspNetCore.Mvc;

namespace Catalog.API
{
    public class BadRequestObjectResult<T> : BadRequestObjectResult, IActionResult<T>
    {
        public BadRequestObjectResult(object error) : base(error)
        {
        }
    }
}
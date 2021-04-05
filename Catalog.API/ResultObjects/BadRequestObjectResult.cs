using Microsoft.AspNetCore.Mvc;

namespace Catalog.API.ResultObjects
{
    public class BadRequestObjectResult<T> : BadRequestObjectResult, IActionResult<T>
    {
        public BadRequestObjectResult(object error) : base(error)
        {
        }
    }
}
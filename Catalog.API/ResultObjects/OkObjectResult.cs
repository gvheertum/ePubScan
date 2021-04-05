using Microsoft.AspNetCore.Mvc;

namespace Catalog.API.ResultObjects
{
    public class OkObjectResult<T> : OkObjectResult, IActionResult<T>
    {
        public OkObjectResult(T value) : base(value)
        {
        }
    }
}
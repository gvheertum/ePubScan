using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Catalog.API.ResultObjects;

namespace Catalog.API.ResultObjects
{
    public class BadRequestObjectResult<T> : BadRequestObjectResult, IActionResult<T>
    {
        public BadRequestObjectResult(HttpRequest req, object error) : base(error)
        {
            req.AddCorsHeadersToRespone();
        }
    }
}
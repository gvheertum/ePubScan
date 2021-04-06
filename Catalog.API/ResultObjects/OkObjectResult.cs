using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Catalog.API.ResultObjects;
namespace Catalog.API.ResultObjects
{
    public class OkObjectResult<T> : OkObjectResult, IActionResult<T>
    {
        public OkObjectResult(HttpRequest req, T value) : base(value)
        {
            req.AddCorsHeadersToRespone();
        }
    }
}
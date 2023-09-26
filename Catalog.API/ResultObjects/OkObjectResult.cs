
using Catalog.API.ResultObjects;
using Microsoft.Azure.Functions.Worker.Http;

namespace Catalog.API.ResultObjects
{
    public class OkObjectResult<T> : IActionResult<T>
    {
        public OkObjectResult(HttpRequestData req, T value)
        {
            req.AddCorsHeadersToRespone();
            ResponseCode = 200;
            Data = value;
            //TODO: Is broken?
        }

        public T Data { get; set; }
        public int ResponseCode { get; set; }
    }
}
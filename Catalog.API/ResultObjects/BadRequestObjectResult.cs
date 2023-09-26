using Catalog.API.ResultObjects;
using Microsoft.Azure.Functions.Worker.Http;

namespace Catalog.API.ResultObjects
{
    public class BadRequestObjectResult<T> : IActionResult<T>
    {
        public BadRequestObjectResult(HttpRequestData req, string message, T value = default)
        {
            req.AddCorsHeadersToRespone();
            ResponseCode = 500;
            Data = value;
            Message = message;
            //TODO: Is broken?
        }

        public T Data { get; set; }
        public string Message { get; set; }
        public int ResponseCode { get; set; }
    }
}
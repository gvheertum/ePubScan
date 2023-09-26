using System.Net;
using System.Threading.Tasks;
using Catalog.API.ResultObjects;
using Microsoft.Azure.Functions.Worker.Http;

namespace Catalog.API.ResultObjects
{
    public class BadHttpResponseResult<T> : IHttpResponseResult<T>
    {
        public async Task<HttpResponseData> GetResponseData(HttpRequestData req, T value)
        {
            return await GetResponseData(req, value, "Undefined error");
        }
        
        public async Task<HttpResponseData> GetResponseData(HttpRequestData req, T value, string error)
        {   
            var response = req.CreateResponse(HttpStatusCode.BadRequest);
            response.AddCorsHeadersToRespone();
            response.Headers.Add("X-API-ERROR", "Error: " + error);
            await response.WriteAsJsonAsync(value);
            return response;
        }
    }
}
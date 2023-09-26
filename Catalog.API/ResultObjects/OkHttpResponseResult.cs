
using System.Net;
using System.Threading.Tasks;
using Catalog.API.ResultObjects;
using Microsoft.Azure.Functions.Worker.Http;

namespace Catalog.API.ResultObjects
{
    public class OkHttpResponseResult<T> : IHttpResponseResult<T>
    {
        public async Task<HttpResponseData> GetResponseData(HttpRequestData req, T value)
        {   
            var response = req.CreateResponse(HttpStatusCode.OK);
            response.AddCorsHeadersToRespone();
            await response.WriteAsJsonAsync(value);
            return response;
        }
    }
}
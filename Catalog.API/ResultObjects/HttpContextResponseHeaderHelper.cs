
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace Catalog.API.ResultObjects
{
    public static class HttpContextResponseHeaderHelper
    {
        public static void AddCorsHeadersToRespone(this HttpRequestData request)
        {
            AddOrReplaceHeader(request, "Access-Control-Allow-Headers", "*");
            AddOrReplaceHeader(request, "Access-Control-Allow-Origin", "*");
        }

        private static void AddOrReplaceHeader(HttpRequestData request, string headerName, string value)
        {
            //if(request.FunctionContext.GetHttpResponseData().Headers.Contains(headerName)) { request.FunctionContext.GetHttpResponseData().Headers.Remove(headerName); }
            //request.FunctionContext.GetHttpResponseData().Headers.Add(headerName, value);
        }
    }
}
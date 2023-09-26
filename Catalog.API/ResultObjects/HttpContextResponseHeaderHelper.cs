
using Azure.Core;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace Catalog.API.ResultObjects
{
    public static class HttpContextResponseHeaderHelper
    {
        public static void AddCorsHeadersToRespone(this HttpResponseData response)
        {
            AddOrReplaceHeader(response, "Access-Control-Allow-Headers", "*");
            AddOrReplaceHeader(response, "Access-Control-Allow-Origin", "*");
        }

        private static void AddOrReplaceHeader(HttpResponseData response, string headerName, string value)
        {
            if(response.Headers.Contains(headerName)) { response.Headers.Remove(headerName); }
            response.Headers.Add(headerName, value);
        }
    }
}
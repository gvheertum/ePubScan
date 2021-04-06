using Microsoft.AspNetCore.Http;

namespace Catalog.API.ResultObjects
{
    public static class HttpContextResponseHeaderHelper
    {
        public static void AddCorsHeadersToRespone(this HttpRequest request)
        {
            AddOrReplaceHeader(request, "Access-Control-Allow-Headers", "*");
            AddOrReplaceHeader(request, "Access-Control-Allow-Origin", "*");
        }

        private static void AddOrReplaceHeader(HttpRequest request, string headerName, string value)
        {
            if(request.HttpContext.Response.Headers.ContainsKey(headerName)) { request.HttpContext.Response.Headers.Remove(headerName); }
            request.HttpContext.Response.Headers.Add(headerName, value);
        }
    }
}
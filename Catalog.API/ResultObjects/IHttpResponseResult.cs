using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace Catalog.API.ResultObjects
{
    public interface IHttpResponseResult<T>
    {
        Task<HttpResponseData> GetResponseData(HttpRequestData req, T value);
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Catalog.API.ResultObjects
{
    public class BaseHttpResult
    {

        //void bliep()
        //{
        //    var response = req.CreateResponse(HttpStatusCode.OK);
        //    await response.WriteAsJsonAsync(obj);
        //    return response;
        //}
    }

    public interface IActionResult<T>
    {
        T Data { get; set; }
        int ResponseCode { get; set; }
    }
}

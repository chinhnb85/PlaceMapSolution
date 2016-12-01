using LibCore.EF;
using PlaceMapADM.Controllers.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ModelCMS.Localtion;

namespace PlaceMapADM.Controllers.ApiControllers
{
    public class LocaltionApiController : BaseApiController
    {
        // GET api/LocaltionApi
        public IEnumerable<LocaltionEntity> Get()
        {
            var ipl = SingletonIpl.GetInstance<IplLocaltion>();
            var data = ipl.ListAll();
            return data;
        }

        // GET api/LocaltionApi
        [HttpGet]
        public object GetListByAccountId(int accountId)
        {
            var ipl = SingletonIpl.GetInstance<IplLocaltion>();
            var data = ipl.ListAll();
            if (data != null && data.Count > 0)
            {
                return Json(new { status = true, message = "Success.", Data = data });
            }
            return Json(new { status = false, message = "Không có bản ghi nào.", Data = data });
        }

        [HttpGet]
        public object CheckedLocaltion(int localtionId, int accountId)
        {
            var ipl = SingletonIpl.GetInstance<IplLocaltion>();
            var data = ipl.UpdateStatus(localtionId);
            if (data)
            {
                return Json(new { status = true, message = "Success.", Data = data });
            }
            return Json(new { status = false, message = "Không có bản ghi nào.", Data = data });
        }

        // GET api/LocaltionApi/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/LocaltionApi
        public void Post([FromBody]string value)
        {
        }

        [HttpPost]
        public object PostAddNew(LocaltionEntity localtion)
        {
            var ipl = SingletonIpl.GetInstance<IplLocaltion>();
            var id = ipl.Insert(localtion);
            if (id != 0)
            {
                return Json(new { status = true, message = "Success.", Data = id });
            }
            return Json(new { status = false, message = "Lỗi thêm địa chỉ.", Data = id });
        }

        // PUT api/LocaltionApi/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/LocaltionApi/5
        public void Delete(int id)
        {
        }
    }
}

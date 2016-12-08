using LibCore.EF;
using PlaceMapADM.Controllers.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ModelCMS.Account;
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

        // GET api/localtionApi/GetListLocaltionByAccountId
        [HttpPost]
        public object GetListLocaltionByAccountId(AccountEntity acc)
        {
            var total = 0;
            var ipl = SingletonIpl.GetInstance<IplLocaltion>();
            var data = ipl.ListAllByAccountId(acc.Id, ref total);
            if (data != null && data.Count > 0)
            {
                return Json(new { status = true, message = "Success.", Total = total, Data = data });
            }
            return Json(new { status = false, message = "Không có bản ghi nào.", Data = data });
        }

        [HttpPost]
        public object CheckedLocaltion(LocaltionEntity loc)
        {
            var ipl = SingletonIpl.GetInstance<IplLocaltion>();
            var data = ipl.CheckedLocaltion(loc);
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
        public object AddNewLocaltion(LocaltionEntity localtion)
        {
            var ipl = SingletonIpl.GetInstance<IplLocaltion>();
            var id = ipl.Insert(localtion);
            if (id != 0)
            {
                var data = ipl.CheckedLocaltion(localtion);
                return Json(new { status = true, message = "Thêm mới thành công.", Data = id });
            }
            return Json(new { status = false, message = "Lỗi thêm địa chỉ.", Data = id });
        }

        [HttpPost]
        public object ViewDetailLocaltion(LocaltionEntity localtion)
        {
            var ipl = SingletonIpl.GetInstance<IplLocaltion>();
            var obj = ipl.ViewDetail(localtion.Id);
            if (obj != null)
            {                
                return Json(new { status = true, message = "Success.", Data = obj });
            }
            return Json(new { status = false, message = "Lỗi thêm địa chỉ."});
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

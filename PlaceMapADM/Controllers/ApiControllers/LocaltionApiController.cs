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
using PlaceMapADM.Code;

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
            var locData = ipl.ViewDetail(loc.Id);
            if (locData != null)
            {
                var ischeck = Common.DistanceBetweenPlaces(Double.Parse(loc.Lag), Double.Parse(loc.Lng), Double.Parse(locData.Lag), Double.Parse(locData.Lng));
                if (ischeck < 100)
                {
                    loc.PlaceNumberWrong = (int)ischeck;
                    var data = ipl.CheckedLocaltion(loc);
                    if (data)
                    {
                        return Json(new {status = true, message = "Checked địa điểm thành công.", Data = data});
                    }
                }
                return Json(new { status = false, message = "Vị trí của bạn quá xa không phù hợp.",Data= ischeck });
            }            
            return Json(new { status = false, message = "Không có bản ghi nào." });
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
            return Json(new { status = false, message = "Vị trí này đã tồn tại. Xin di chuyển đến vị trí khác để thêm.", Data = id });
        }

        [HttpPost]
        public object ViewDetailLocaltion(LocaltionEntity localtion)
        {
            var ipl = SingletonIpl.GetInstance<IplLocaltion>();
            var obj = ipl.ViewDetailLocaltionNow(localtion.Id);
            if (obj != null)
            {                
                return Json(new { status = true, message = "Success.", Data = obj });
            }
            return Json(new { status = false, message = "Không thể lấy được địa chỉ này."});
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

using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PlaceMapADM.Controllers.Base;
using LibCore.EF;
using ModelCMS.Localtion;

namespace PlaceMapADM.Controllers
{
    public class AccountCheckedController : BaseController
    {
        // GET: AccountChecked        
        public ActionResult Index()
        {
            return View();
        }
        
        [HttpGet]
        public JsonResult LocaltionAccountCheckListAllByAccountId(int accountId,string startDate, string endDate, int pageIndex, int pageSize)
        {
            try
            {
                DateTime sDate = DateTime.ParseExact(string.IsNullOrEmpty(startDate) ? DateTime.Now.ToString("dd/MM/yyyy") : startDate, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                DateTime eDate = DateTime.ParseExact(string.IsNullOrEmpty(endDate) ? DateTime.Now.ToString("dd/MM/yyyy") : endDate, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                var total = 0;                
                var ipl = SingletonIpl.GetInstance<IplLocaltion>();
                var res = ipl.LocaltionAccountCheckListAllByAccountId(accountId,sDate,eDate, pageIndex, pageSize, ref total);

                if (res != null && res.Count > 0)
                {
                    return Json(new
                    {
                        status = true,
                        Data = res,
                        totalCount = res.Count,
                        totalRow = total
                    }, JsonRequestBehavior.AllowGet);
                }

                return Json(new
                {
                    status = true,
                    Data = res,
                    totalCount = 0,
                    totalRow = 0
                }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new
                {
                    status = false,
                    totalCount = 0,
                    totalRow = 0
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult LocaltionAccountCheckListAllByLocaltionId(int localtionId, string startDate, string endDate, int pageIndex, int pageSize)
        {
            try
            {
                DateTime sDate = DateTime.ParseExact(string.IsNullOrEmpty(startDate) ? DateTime.Now.ToString("dd/MM/yyyy") : startDate, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                DateTime eDate = DateTime.ParseExact(string.IsNullOrEmpty(endDate) ? DateTime.Now.ToString("dd/MM/yyyy") : endDate, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                var total = 0;
                var ipl = SingletonIpl.GetInstance<IplLocaltion>();
                var res = ipl.LocaltionAccountCheckListAllByLocaltionId(localtionId, sDate, eDate, pageIndex, pageSize, ref total);

                if (res != null && res.Count > 0)
                {
                    return Json(new
                    {
                        status = true,
                        Data = res,
                        totalCount = res.Count,
                        totalRow = total
                    }, JsonRequestBehavior.AllowGet);
                }

                return Json(new
                {
                    status = true,
                    Data = res,
                    totalCount = 0,
                    totalRow = 0
                }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new
                {
                    status = false,
                    totalCount = 0,
                    totalRow = 0
                }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}
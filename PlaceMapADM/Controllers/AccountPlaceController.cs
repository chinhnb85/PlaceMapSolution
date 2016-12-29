using PlaceMapADM.Controllers.Base;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LibCore.EF;
using ModelCMS.AccountPlace;
using ModelCMS.Localtion;

namespace PlaceMapADM.Controllers
{
    public class AccountPlaceController : BaseController
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Home Page";

            return View();
        }


        [HttpGet]
        public JsonResult LoadAllAccountPlaceByUserAndDate(int accountId, string dateTime)
        {
            try
            {
                DateTime date = DateTime.ParseExact(string.IsNullOrEmpty(dateTime) ? DateTime.Now.ToString("dd/MM/yyyy") : dateTime, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                var total = 0;
                var ipl = SingletonIpl.GetInstance<IplAccountPlace>();
                var res = ipl.ListAllByAccountIdAndDatetime(accountId, date, ref total);

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

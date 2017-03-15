using LibCore.EF;
using ModelCMS.Statistic;
using PlaceMapADM.Controllers.Base;
using PlaceMapADM.Excel;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PlaceMapADM.Controllers
{
    public class StatisticController : BaseController
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Statistic Page";

            return View();
        }

        [HttpGet]
        public JsonResult ListStatisticPaging(string startDate,string endDate, int pageIndex, int pageSize)
        {
            try
            {
                var sDate = DateTime.ParseExact(string.IsNullOrEmpty(startDate) ? DateTime.Now.ToString("dd/MM/yyyy") : startDate, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                var eDate = DateTime.ParseExact(string.IsNullOrEmpty(endDate) ? DateTime.Now.ToString("dd/MM/yyyy") : endDate, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                var total = 0;                
                var ipl = SingletonIpl.GetInstance<IplStatistic>();
                var res = ipl.ListStatisticPaging(sDate, eDate, pageIndex, pageSize, ref total);

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
        public JsonResult ExportExcelAllStatistic(string startDate, string endDate)
        {
            try
            {
                var sDate = DateTime.ParseExact(string.IsNullOrEmpty(startDate) ? DateTime.Now.ToString("dd/MM/yyyy") : startDate, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                var eDate = DateTime.ParseExact(string.IsNullOrEmpty(endDate) ? DateTime.Now.ToString("dd/MM/yyyy") : endDate, "dd/MM/yyyy", CultureInfo.InvariantCulture);

                var res = OfficeHelper.CreateFileStatistic(sDate, eDate);
                if (res.Status)
                {
                    return Json(new
                    {
                        status = true,
                        Data = res.Data,
                        totalCount = 0,
                        totalRow = 0
                    }, JsonRequestBehavior.AllowGet);
                }
                return Json(new
                {
                    status = false,
                    Data = res.Data,
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

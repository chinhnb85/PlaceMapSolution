using LibCore.EF;
using ModelCMS.SchedulerCheckin;
using PlaceMapADM.Controllers.Base;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PlaceMapADM.Controllers
{
    public class SchedulerCheckinController : BaseController
    {
        public ActionResult Index()
        {
            ViewBag.Title = "SchedulerCheckin Page";

            return View();
        }

        [HttpGet]
        public JsonResult GetListScheduleCheckinByUserId(int userId, string startDate, string endDate)
        {
            try
            {
                DateTime sDate = DateTime.ParseExact(string.IsNullOrEmpty(startDate) ? DateTime.Now.ToString("dd/MM/yyyy") : startDate, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                DateTime eDate = DateTime.ParseExact(string.IsNullOrEmpty(endDate) ? DateTime.Now.ToString("dd/MM/yyyy") : endDate, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                var total = 0;
                var ipl = SingletonIpl.GetInstance<IplSchedulerCheckin>();
                var res = ipl.GetListScheduleCheckinByUserId(userId, sDate, eDate);

                if (res != null && res.Count > 0)
                {
                    return Json(new
                    {
                        data = res.Select(s => new {
                            id = s.Id.ToString(),
                            start_date = s.StartDate.ToString("yyyy-MM-dd hh:mm:ss"),
                            end_date = s.EndDate.ToString("yyyy-MM-dd hh:mm:ss"),
                            text = s.Description,
                            details = s.Description,
                            localtion_id=s.LocaltionId.ToString(),
                            account_id = s.AccountId.ToString()
                        }).ToList()                        
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
            catch(Exception ex)
            {
                return Json(new
                {
                    status = false,
                    totalCount = 0,
                    totalRow = 0
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult UpdateData(string editing,FormCollection formCollection)
        {
            try
            {
                if (!string.IsNullOrEmpty(editing) && Convert.ToBoolean(editing))
                {                    
                    var ipl = SingletonIpl.GetInstance<IplSchedulerCheckin>();

                    var ids = formCollection.Get("ids");
                    var status = formCollection.Get(ids+ "_!nativeeditor_status");
                    var localtionId = formCollection.Get(ids + "_localtion_id");
                    var accountId = formCollection.Get(ids + "_account_id");
                    var text = formCollection.Get(ids + "_text");
                    var startDate = formCollection.Get(ids + "_start_date");
                    var endDate = formCollection.Get(ids + "_end_date");

                    if (status.Equals("inserted"))
                    {
                        var res = ipl.Insert(new SchedulerCheckinEntity
                        {
                            AccountId = Convert.ToInt32(accountId),
                            LocaltionId = Convert.ToInt32(localtionId),
                            Description = text,
                            StartDate = Convert.ToDateTime(startDate),
                            EndDate = Convert.ToDateTime(endDate)
                        });
                        if (res != 0)
                        {
                            return Json(new
                            {
                                data = true
                            }, JsonRequestBehavior.AllowGet);
                        }
                    }else if (status.Equals("updated"))
                    {
                        var res = ipl.Update(new SchedulerCheckinEntity
                        {
                            Id = Convert.ToInt32(ids),
                            AccountId = Convert.ToInt32(accountId),
                            LocaltionId = Convert.ToInt32(localtionId),
                            Description = text,
                            StartDate = Convert.ToDateTime(startDate),
                            EndDate = Convert.ToDateTime(endDate)
                        });
                        if (res)
                        {
                            return Json(new
                            {
                                data = true
                            }, JsonRequestBehavior.AllowGet);
                        }
                    }
                    else if (status.Equals("deleted"))
                    {
                        var res = ipl.Delete(Convert.ToInt32(ids));
                        if (res)
                        {
                            return Json(new
                            {
                                data = true
                            }, JsonRequestBehavior.AllowGet);
                        }
                    }

                }
                return Json(new
                {
                    status = true,                    
                    totalCount = 0,
                    totalRow = 0
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
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

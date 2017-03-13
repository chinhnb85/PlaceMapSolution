using PlaceMapADM.Controllers.Base;
using System;
using System.Collections.Generic;
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
    }
}

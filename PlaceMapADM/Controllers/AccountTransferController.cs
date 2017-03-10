using PlaceMapADM.Controllers.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PlaceMapADM.Controllers
{
    public class AccountTransferController : BaseController
    {
        public ActionResult Index()
        {
            ViewBag.Title = "AccountTransfer Page";

            return View();
        }
    }
}

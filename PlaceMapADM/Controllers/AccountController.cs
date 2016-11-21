using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PlaceMapADM.Controllers.Base;
using LibCore.EF;
using ModelCMS.Account;

namespace PlaceMapADM.Controllers
{
    public class AccountController : BaseController
    {
        // GET: /Account
        [AllowAnonymous]
        public ActionResult Index(string returnUrl)
        {
            ViewBag.ReturnUrl = returnUrl;
            return View();
        }
        
        public JsonResult ListAll()
        {
            var total = 0;
            var ipl = SingletonIpl.GetInstance<IplAccount>();
            var data = ipl.ListAll();

            return Json(new
            {
                status = total > 0,
                Data = data,
                totalCount = total
            }, JsonRequestBehavior.AllowGet);
        }
    }
}
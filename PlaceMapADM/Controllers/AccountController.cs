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
        // GET: Account        
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Add(string name, int parentId)
        {
            try
            {
                var obj = new AccountEntity
                {                                        
                    ParentId = parentId,
                    Type = 1,
                    DisplayName = "",
                    UserName = "admin",
                    Password = "",
                    Email = "",
                    DeviceMobile = "",
                    CreatedDate = DateTime.Now,
                    Status = true
                };
                var ipl = SingletonIpl.GetInstance<IplAccount>();
                var res = ipl.Insert(obj);

                return Json(new { status = res, Data = res }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { status = false }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult ListAllPaging(int pageIndex, int pageSize)
        {
            try
            {
                var total = 0;
                var obj = new AccountEntity();
                var ipl = SingletonIpl.GetInstance<IplAccount>();
                var res = ipl.ListAllPaging(obj, pageIndex, pageSize, "", "", ref total);

                if (res != null && res.Count > 0)
                {
                    return Json(new { status = res, Data = res }, JsonRequestBehavior.AllowGet);
                }

                return Json(new { status = res, Data = "" }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { status = false, Data = "" }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}
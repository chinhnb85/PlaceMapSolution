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
        public JsonResult Add(FormCollection collection)
        {
            try
            {
                var displayname = collection["txtDisplayName"];
                var username = collection["txtUserName"];
                var password = collection["txtPassword"];
                var email = collection["txtEmail"];
                var birthday = collection["txtBirthDay"];
                var address = collection["txtAddress"];
                var phone = collection["txtPhone"];
                var status = collection["cbxStatus"];
                var account = new AccountEntity
                {                    
                    DisplayName = displayname,
                    UserName = username,
                    Password = password,
                    Email = email,
                    BirthDay = Convert.ToDateTime(birthday),
                    Address = address,
                    Phone = phone,
                    CreatedDate = DateTime.Now,
                    Status = true
                };
                var ipl = SingletonIpl.GetInstance<IplAccount>();
                var res = ipl.Insert(account);

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
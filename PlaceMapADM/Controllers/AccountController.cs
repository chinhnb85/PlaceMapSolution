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
                var id= long.Parse(collection["hdAccountId"]);
                var displayname = collection["txtDisplayName"];
                var username = collection["txtUserName"];
                var password = collection["txtPassword"];
                var email = collection["txtEmail"];
                var birthday = collection["txtBirthDay"];
                var address = collection["txtAddress"];
                var phone = collection["txtPhone"];
                var status = (collection["cbxStatus"] ?? "").Equals("on", StringComparison.CurrentCultureIgnoreCase);
                var account = new AccountEntity
                {                    
                    Id=id,
                    DisplayName = displayname,
                    UserName = username,
                    Password = password,
                    Email = email,
                    BirthDay = Convert.ToDateTime((birthday==null || birthday == "") ? DateTime.Now.ToString(): birthday),
                    Address = address,
                    Phone = phone,
                    CreatedDate = DateTime.Now,
                    Status = status
                };
                var ipl = SingletonIpl.GetInstance<IplAccount>();                
                if (id == 0)
                {
                    id = ipl.Insert(account);
                    return Json(new { status = true, Data = id }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    var res = ipl.Update(account);
                    return Json(new { status = res, Data = res }, JsonRequestBehavior.AllowGet);
                }                                
            }
            catch
            {
                return Json(new { status = false }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult GetAccountById(int Id)
        {
            try
            {
                var ipl = SingletonIpl.GetInstance<IplAccount>();
                var res = ipl.ViewDetail(Id);

                return Json(new { status = true, Data = res }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { status = false }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult Delete(int Id)
        {
            try
            {                
                var ipl = SingletonIpl.GetInstance<IplAccount>();
                var res = ipl.Delete(Id);

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
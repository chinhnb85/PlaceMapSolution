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
    public class LocaltionController : BaseController
    {
        // GET: Localtion        
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Add(FormCollection collection)
        {
            try
            {
                var id= long.Parse(collection["hdLocaltionId"]);
                var displayname = collection["txtDisplayName"];
                var username = collection["txtUserName"];
                var password = collection["txtPassword"];
                var email = collection["txtEmail"];
                var birthday = collection["txtBirthDay"];
                DateTime dt = DateTime.ParseExact(string.IsNullOrEmpty(birthday) ? DateTime.Now.ToString("dd/MM/yyyy") : birthday, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                var address = collection["txtAddress"];
                var phone = collection["txtPhone"];
                var status = (collection["cbxStatus"] ?? "").Equals("on", StringComparison.CurrentCultureIgnoreCase);
                var Localtion = new LocaltionEntity
                {                    
                    Id=id,
                    ParentId=null,
                    Type = null,
                    DisplayName = displayname,
                    UserName = username,
                    Password = password,
                    Email = email,
                    BirthDay = dt,
                    Address = address,
                    Phone = phone,
                    CreatedDate = DateTime.Now,
                    Status = status
                };
                var ipl = SingletonIpl.GetInstance<IplLocaltion>();                
                if (id == 0)
                {
                    id = ipl.Insert(Localtion);
                    return Json(new { status = true, Data = id }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    var res = ipl.Update(Localtion);
                    return Json(new { status = res, Data = res }, JsonRequestBehavior.AllowGet);
                }                                
            }
            catch(Exception ex)
            {
                return Json(new { status = false, message=ex.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult GetLocaltionById(int Id)
        {
            try
            {
                var ipl = SingletonIpl.GetInstance<IplLocaltion>();
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
                var ipl = SingletonIpl.GetInstance<IplLocaltion>();
                var res = ipl.Delete(Id);

                return Json(new { status = res, Data = res }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { status = false }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult UpdateStatus(int Id)
        {
            try
            {
                var ipl = SingletonIpl.GetInstance<IplLocaltion>();
                var res = ipl.UpdateStatus(Id);

                return Json(new { status = res, Data = res }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { status = false }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult ListAllPaging(string keySearch, int pageIndex, int pageSize)
        {
            try
            {
                var total = 0;
                var obj = new LocaltionEntity();
                var ipl = SingletonIpl.GetInstance<IplLocaltion>();
                var res = ipl.ListAllPaging(keySearch, pageIndex, pageSize, "", "", ref total);

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
        public JsonResult getObject()
        {
            try
            {
                var user = Code.SessionUtility.GetUser();

                return Json(new { status = true, Data = user }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { status = false }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}
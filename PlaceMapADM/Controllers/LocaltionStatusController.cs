using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PlaceMapADM.Controllers.Base;
using LibCore.EF;
using LibCore.Helper;
using ModelCMS.LocaltionStatus;
using PlaceMapADM.Code;

namespace PlaceMapADM.Controllers
{
    public class LocaltionStatusController : BaseController
    {
        // GET: LocaltionStatus        
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Add(FormCollection collection)
        {
            try
            {
                var id= long.Parse(collection["hdLocaltionStatusId"]);
                var name = collection["txtName"];                
               
                var localtionStatus = new LocaltionStatusEntity
                {                    
                    Id=id,                                        
                    Name = name
                };
                var ipl = SingletonIpl.GetInstance<IplLocaltionStatus>();

                if (id == 0)
                {
                    id = ipl.Insert(localtionStatus);
                    return Json(new { status = true, Data = id }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    var res = ipl.Update(localtionStatus);
                    return Json(new { status = res, Data = res }, JsonRequestBehavior.AllowGet);
                }
                                             
            }
            catch(Exception ex)
            {
                return Json(new { status = false, message="Lỗi không lưu được trạng thái." }, JsonRequestBehavior.AllowGet);
            }
        }       

        [HttpGet]
        public JsonResult Delete(int Id)
        {
            try
            {                
                var ipl = SingletonIpl.GetInstance<IplLocaltionStatus>();
                var res = ipl.Delete(Id);

                return Json(new { status = res, Data = res }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { status = false }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult GetLocaltionStatusById(int Id)
        {
            try
            {
                var ipl = SingletonIpl.GetInstance<IplLocaltionStatus>();
                var res = ipl.ViewDetail(Id);
                if (res != null)
                {                    
                    return Json(new { status = true, Data = res }, JsonRequestBehavior.AllowGet);
                }

                return Json(new { status = false, Data = res }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { status = false }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult ListAll()
        {
            try
            {                
                var obj = new LocaltionStatusEntity();
                var ipl = SingletonIpl.GetInstance<IplLocaltionStatus>();
                var res = ipl.ListAll();

                if (res != null && res.Count > 0)
                {
                    return Json(new
                    {
                        status = true,
                        Data = res,
                        totalCount=res.Count
                    }, JsonRequestBehavior.AllowGet);
                }

                return Json(new
                {
                    status = true,
                    Data = res,
                    totalCount = 0
                }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new
                {
                    status = false                    
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult ListAllPaging(string keySearch, int pageIndex, int pageSize)
        {
            try
            {
                var total = 0;
                var obj = new LocaltionStatusEntity();
                var ipl = SingletonIpl.GetInstance<IplLocaltionStatus>();
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
    }
}
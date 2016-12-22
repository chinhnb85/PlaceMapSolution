using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PlaceMapADM.Controllers.Base;
using LibCore.EF;
using LibCore.Helper;
using ModelCMS.Province;
using PlaceMapADM.Code;

namespace PlaceMapADM.Controllers
{
    public class ProvinceController : BaseController
    {
        // GET: Province        
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Add(FormCollection collection)
        {
            try
            {
                var id= long.Parse(collection["hdProvinceId"]);
                var name = collection["txtName"];
                var type = collection["txtType"];
               
                var province = new ProvinceEntity
                {                    
                    Id=id,                                        
                    Name = name,
                    Type = type
                };
                var ipl = SingletonIpl.GetInstance<IplProvince>();

                if (id == 0)
                {
                    id = ipl.Insert(province);
                    return Json(new { status = true, Data = id }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    var res = ipl.Update(province);
                    return Json(new { status = res, Data = res }, JsonRequestBehavior.AllowGet);
                }
                                             
            }
            catch(Exception ex)
            {
                return Json(new { status = false, message="Lỗi không lưu được tài khoản." }, JsonRequestBehavior.AllowGet);
            }
        }       

        [HttpGet]
        public JsonResult Delete(int Id)
        {
            try
            {                
                var ipl = SingletonIpl.GetInstance<IplProvince>();
                var res = ipl.Delete(Id);

                return Json(new { status = res, Data = res }, JsonRequestBehavior.AllowGet);
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
                var total = 0;
                var obj = new ProvinceEntity();
                var ipl = SingletonIpl.GetInstance<IplProvince>();
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
        public JsonResult ListAllDistrictByProvinceId(int provinceId)
        {
            try
            {
                var total = 0;
                var obj = new ProvinceEntity();
                var ipl = SingletonIpl.GetInstance<IplProvince>();
                var res = ipl.ListAllDistrictByProvinceId(provinceId);

                if (res != null && res.Count > 0)
                {
                    return Json(new
                    {
                        status = true,
                        Data = res,
                        totalCount = res.Count
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
    }
}
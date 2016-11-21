using LibCore.EF;
using PlaceMapADM.Code;
using ModelCMS.Product;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PlaceMapADM.Controllers
{
    public class ProductController : Controller
    {
        // GET: Product/Created       
        public ActionResult Created()
        {
            return View();
        }

        // GET: Product/List       
        public ActionResult List()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Add(string name, int parentId)
        {
            try
            {
                var obj = new ProductEntity {
                    Name = name,
                    Url = Common.ConvertTextToUrl(name),
                    CategoryId = parentId,
                    ManufacturerId = 1,
                    IsHighlights = false,
                    CreatedBy = "admin"
                };
                var ipl = SingletonIpl.GetInstance<IplProduct>();
                var res = ipl.Insert(obj);
                                
                return Json(new { status = res, Data = res }, JsonRequestBehavior.AllowGet);                               
            }
            catch
            {
                return Json(new { status = false }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult ListAllPaging(int pageIndex,int pageSize)
        {
            try
            {
                var total = 0;
                var obj = new ProductEntity();
                var ipl = SingletonIpl.GetInstance<IplProduct>();
                var res = ipl.ListAllPaging(obj, pageIndex,pageSize,"","", ref total);

                if (res!=null && res.Count>0)
                {
                    return Json(new { status = res, Data = res }, JsonRequestBehavior.AllowGet);
                }

                return Json(new { status = res, Data ="" }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { status = false,Data="" }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}
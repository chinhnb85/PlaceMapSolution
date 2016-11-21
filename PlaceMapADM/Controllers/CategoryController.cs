using LibCore.EF;
using PlaceMapADM.Code;
using ModelCMS.Category;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PlaceMapADM.Controllers
{
    public class CategoryController : Controller
    {
        // GET: Category        
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Add(string name, int parentId)
        {
            try
            {
                var obj = new CategoryEntity {
                    Name = name,
                    Url = Common.ConvertTextToUrl(name),
                    ParentId = parentId,
                    Type = 1,
                    Position = 1,
                    CreatedBy = "admin"
                };
                var ipl = SingletonIpl.GetInstance<IplCategory>();
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
                var obj = new CategoryEntity();
                var ipl = SingletonIpl.GetInstance<IplCategory>();
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
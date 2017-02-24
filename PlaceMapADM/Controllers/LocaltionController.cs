﻿using System;
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
                var accountId = int.Parse(collection["sltAccount"]);
                var provinceId = int.Parse(collection["sltProvince"]);
                var districtId = int.Parse(collection["sltDistrict"]);
                var customeType = int.Parse(collection["sltCustomeType"]);
                var name = collection["txtName"];
                var lag = collection["txtLag"];
                var lng = collection["txtLng"];
                var avatar = collection["txtAvatar"];                
                var email = collection["txtEmail"];                
                var address = collection["txtAddress"];
                var phone = collection["txtPhone"];
                var code = collection["txtCode"];
                var representActive = collection["txtRepresentActive"];
                var minCheckin = int.Parse(collection["txtMinCheckin"]);
                var status = (collection["cbxStatus"] ?? "").Equals("on", StringComparison.CurrentCultureIgnoreCase);
                var statusEdit = (collection["cbxStatusEdit"] ?? "").Equals("on", StringComparison.CurrentCultureIgnoreCase);
                var localtion = new LocaltionEntity
                {                    
                    Id=id,
                    AccountId = accountId,
                    ProvinceId=provinceId,
                    DistrictId=districtId,
                    CustomeType=customeType,
                    Lag= lag,
                    Lng = lng,
                    Name = name,
                    Avatar = avatar,                    
                    Email = email,                                        
                    Address = address,
                    Phone = phone,
                    CreatedDate = DateTime.Now,
                    Status = status,
                    Code = code,
                    RepresentActive = representActive,
                    MinCheckin = minCheckin,
                    StatusEdit = statusEdit
                };
                var ipl = SingletonIpl.GetInstance<IplLocaltion>();                
                if (id == 0)
                {
                    id = ipl.Insert(localtion);
                    if (id != 0)
                    {
                        return Json(new { status = true, Data = id }, JsonRequestBehavior.AllowGet);
                    }
                    return Json(new { status = false, Data = id }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    var res = ipl.Update(localtion);                    
                    return Json(new { status = res, Data = res }, JsonRequestBehavior.AllowGet);
                }                                
            }
            catch(Exception ex)
            {
                return Json(new { status = false, message=ex.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult AddNew(FormCollection collection)
        {
            try
            {
                var id = long.Parse(collection["hdLocaltionId"]);
                var accountId = int.Parse(collection["sltAccount"]);
                var provinceId = int.Parse(collection["sltProvince"]);
                var districtId = int.Parse(collection["sltDistrict"]);
                var name = collection["txtName"];
                var lag = collection["txtLag"];
                var lng = collection["txtLng"];
                var avatar = collection["txtAvatar"];
                var email = collection["txtEmail"];
                var address = collection["txtAddress"];
                var phone = collection["txtPhone"];
                var status = (collection["cbxStatus"] ?? "").Equals("on", StringComparison.CurrentCultureIgnoreCase);
                var statusEdit = (collection["cbxStatusEdit"] ?? "").Equals("on", StringComparison.CurrentCultureIgnoreCase);
                var localtion = new LocaltionEntity
                {
                    Id = id,
                    AccountId = accountId,
                    ProvinceId = provinceId,
                    DistrictId = districtId,
                    Lag = lag,
                    Lng = lng,
                    Name = name,
                    Avatar = avatar,
                    Email = email,
                    Address = address,
                    Phone = phone,
                    CreatedDate = DateTime.Now,
                    Status = status,
                    StatusEdit = statusEdit
                };
                var ipl = SingletonIpl.GetInstance<IplLocaltion>();
                id = ipl.Insert(localtion);
                if (id != 0)
                {
                    return Json(new { status = true, Data = id }, JsonRequestBehavior.AllowGet);
                }
                return Json(new { status = false, Data = id }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.ToString() }, JsonRequestBehavior.AllowGet);
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
        public JsonResult ViewDetailLocaltionNow(long Id)
        {
            try
            {
                var ipl = SingletonIpl.GetInstance<IplLocaltion>();
                var res = ipl.ViewDetailLocaltionNow(Id);

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
        public JsonResult UpdateStatusEdit(int Id)
        {
            try
            {
                var ipl = SingletonIpl.GetInstance<IplLocaltion>();
                var res = ipl.UpdateStatusEdit(Id);

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
                var ipl = SingletonIpl.GetInstance<IplLocaltion>();
                var res = ipl.ListAll();

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
        public JsonResult ListAllPaging(int accountId, int parentId, int provinceId, string keySearch, int pageIndex, int pageSize)
        {
            try
            {
                var total = 0;                
                var ipl = SingletonIpl.GetInstance<IplLocaltion>();
                var res = ipl.ListAllPaging(accountId, parentId, provinceId, keySearch, pageIndex, pageSize, "", "", ref total);

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
        public JsonResult ListAllPagingByStatus(int accountId, int parentId, int provinceId, string keySearch, int pageIndex, int pageSize)
        {
            try
            {
                var total = 0;
                var ipl = SingletonIpl.GetInstance<IplLocaltion>();
                var res = ipl.ListAllPagingByStatus(accountId, parentId, provinceId, keySearch, pageIndex, pageSize, "", "", ref total);

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
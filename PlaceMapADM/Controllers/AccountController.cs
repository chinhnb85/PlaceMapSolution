using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PlaceMapADM.Controllers.Base;
using LibCore.EF;
using LibCore.Helper;
using ModelCMS.Account;
using PlaceMapADM.Code;

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
                var password = Utility.EncryptMd5(collection["txtPassword"]);
                var email = collection["txtEmail"];
                var birthday = collection["txtBirthDay"];
                DateTime dt = DateTime.ParseExact(string.IsNullOrEmpty(birthday) ? DateTime.Now.ToString("dd/MM/yyyy") : birthday, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                var address = collection["txtAddress"];
                var phone = collection["txtPhone"];
                var status = (collection["cbxStatus"] ?? "").Equals("on", StringComparison.CurrentCultureIgnoreCase);
                var type = int.Parse(collection["sltType"]);
                var parentId = int.Parse(collection["sltParent"]);
                var provinceId = int.Parse(collection["sltProvince"]);
                var account = new AccountEntity
                {                    
                    Id=id,
                    ParentId= parentId,
                    ProvinceId = provinceId,
                    Type = type,
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
                var ipl = SingletonIpl.GetInstance<IplAccount>();

                if (id == 0)
                {
                    var user = ipl.GetAccountByUserName(username);
                    if (user == null)
                    {
                        id = ipl.Insert(account);
                        return Json(new { status = true, Data = id }, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        return Json(new { status = false, message = "Tài khoản này đã tồn tại." }, JsonRequestBehavior.AllowGet);
                    }
                }
                else
                {
                    var res = ipl.Update(account);
                    return Json(new { status = res, Data = res }, JsonRequestBehavior.AllowGet);
                }
                                             
            }
            catch(Exception ex)
            {
                return Json(new { status = false, message="Lỗi không lưu được tài khoản." }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult GetAccountById(int Id)
        {
            try
            {
                var ipl = SingletonIpl.GetInstance<IplAccount>();
                var res = ipl.ViewDetail(Id);
                if (res != null)
                {
                    res.Password = Utility.DecryptMd5(res.Password);
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
        public JsonResult UpdateStatus(int Id)
        {
            try
            {
                var ipl = SingletonIpl.GetInstance<IplAccount>();
                var res = ipl.UpdateStatus(Id);

                return Json(new { status = res, Data = res }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { status = false }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult ListAllPaging(int type,int parentId,int provinceId, string keySearch, int pageIndex, int pageSize)
        {
            try
            {
                var total = 0;
                var obj = new AccountEntity();
                var ipl = SingletonIpl.GetInstance<IplAccount>();
                var res = ipl.ListAllPaging(type, parentId,provinceId, keySearch, pageIndex, pageSize, "", "", ref total);

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
        public JsonResult ListAllPagingByStatus(int type, string keySearch, int pageIndex, int pageSize)
        {
            try
            {
                var total = 0;
                var obj = new AccountEntity();
                var ipl = SingletonIpl.GetInstance<IplAccount>();
                var res = ipl.ListAllPagingByStatus(type, keySearch, pageIndex, pageSize, "", "", ref total);

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
                var ipl = SingletonIpl.GetInstance<IplAccount>();
                var res = ipl.ViewDetail(user.Id);

                return Json(new { status = true, Data = res }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { status = false }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult updateAccountAvatar(int Id,string Avatar)
        {
            try
            {
                var ipl = SingletonIpl.GetInstance<IplAccount>();
                var res = ipl.UpdateAvatar(Id, Avatar);

                return Json(new { status = res, Data = res }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { status = false }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult ListAllByType(int type)
        {
            try
            {
                var total = 0;
                var obj = new AccountEntity();
                var ipl = SingletonIpl.GetInstance<IplAccount>();
                var res = ipl.ListAllByType(type);

                if (res != null && res.Count > 0)
                {
                    return Json(new
                    {
                        status = true,
                        Data = res,
                        totalCount = res.Count,
                        totalRow = 0
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
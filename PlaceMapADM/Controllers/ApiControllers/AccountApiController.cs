using LibCore.EF;
using PlaceMapADM.Controllers.Base;
using System.Collections.Generic;
using System.Web.Http;
using LibCore.Helper;
using ModelCMS.Account;
using PlaceMapADM.Code;

namespace PlaceMapADM.Controllers.ApiControllers
{
    public class AccountApiController : BaseApiController
    {
        // GET api/accountApi
        public IEnumerable<AccountEntity> Get()
        {
            var ipl = SingletonIpl.GetInstance<IplAccount>();
            var data = ipl.ListAll();
            return data;
        }

        // GET api/accountApi/5
        public AccountEntity Get(int id)
        {
            var ipl = SingletonIpl.GetInstance<IplAccount>();
            var data = ipl.ViewDetail(id);
            return data;
        }

        // POST api/accountApi/CheckLogin
        [HttpPost]
        public object CheckLogin(AccountEntity acc)
        {
            if (acc != null)
            {
                acc.Password = Utility.EncryptMd5(acc.Password);
                AccountEntity obj = new AccountEntity();
                var ipl = SingletonIpl.GetInstance<IplAccount>();
                var data = ipl.LoginDevice(acc,ref obj);
                if (data)
                {
                    data = ipl.UpdateDevice(obj.Id, acc.DeviceMobile);
                    if (data)
                    {
                        obj.DeviceMobile = acc.DeviceMobile;
                    }
                    return new { status = true, message = "Đăng nhập thành công.", Data = obj };
                }
                return new { status = false, message = "Tài khoản or mật khẩu đăng nhập không đúng. Thử lại", Data= obj };
            }
            return new { status = false, message = "Đã có lỗi xảy ra." };
        }

        // POST api/accountApi
        public object Post([FromBody]string value)
        {            
            return value;
        }
        
        // POST api/accountApi
        public AccountEntity Post(int id)
        {
            var ipl = SingletonIpl.GetInstance<IplAccount>();
            var data = ipl.ViewDetail(id);
            return data;
        }

        // PUT api/accountApi/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/accountApi/5
        public void Delete(int id)
        {
        }
    }
}

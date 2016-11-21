using LibCore.EF;
using PlaceMapADM.Controllers.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ModelCMS.Account;

namespace PlaceMapADM.Controllers.ApiControllers
{
    public class UserApiController : BaseApiController
    {
        // GET api/userApi
        public IEnumerable<AccountEntity> Get()
        {
            var ipl = SingletonIpl.GetInstance<IplAccount>();
            var data = ipl.ListAll();
            return data;
        }

        // GET api/userApi/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/userApi
        public void Post([FromBody]string value)
        {
        }

        // PUT api/userApi/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/userApi/5
        public void Delete(int id)
        {
        }
    }
}

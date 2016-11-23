using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ModelCMS.Base
{
    public class UserSession
    {
        public string SessionId { get; set; }
        public int Id { get; set; }
        public int? UserType { get; set; }
        public string UserName { get; set; }
        public string DisplayName { get; set; }
        public string Avatar { get; set; }
    }
}
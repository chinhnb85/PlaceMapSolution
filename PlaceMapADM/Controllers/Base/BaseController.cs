using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using ModelCMS.Base;
using PlaceMapADM.Code;

namespace PlaceMapADM.Controllers.Base
{
    public class BaseController : Controller
    {
        public UserSession us
        {
            get { return SessionUtility.GetUser(); }
            set { SessionUtility.SetUser(value); }
        }

        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (SessionUtility.GetUser() == null)
            {
                filterContext.Result = new RedirectToRouteResult(new
                    RouteValueDictionary(new { controller = "Login", action = "Index" }));
            }
            base.OnActionExecuting(filterContext);
        }
    }
}
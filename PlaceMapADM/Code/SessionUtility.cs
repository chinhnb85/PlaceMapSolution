using ModelCMS.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PlaceMapADM.Code
{
    [Serializable]
    public class SessionUtility
    {
        public static readonly string user = "user";
        public static UserSession GetUser()
        {

            if (HttpContext.Current != null &&
                HttpContext.Current.Session != null &&
                HttpContext.Current.Session.Count > 0 &&
                HttpContext.Current.Session[SessionUtility.user] != null)
            {
                return HttpContext.Current.Session[SessionUtility.user] as UserSession;
            }
            return null;
        }

        /// <summary>
        /// Sets the user.
        /// </summary>
        /// <param name="user">The user.</param>
        /// <returns><c>true</c> if XXXX, <c>false</c> otherwise</returns>
        public static bool SetUser(UserSession user)
        {
            HttpContext.Current.Session.Remove(SessionUtility.user);
            user.SessionId = HttpContext.Current.Session.SessionID;
            HttpContext.Current.Session.Add(SessionUtility.user, user);
            return true;
        }

        /// <summary>
        /// Clears the session.
        /// </summary>
        public static void ClearSession()
        {
            HttpContext.Current.Session.Clear();
            HttpContext.Current.Session.Abandon();
        }
    }
}
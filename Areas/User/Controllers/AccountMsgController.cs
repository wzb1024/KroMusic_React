using KroMusic.Filter;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using BLL;

namespace KroMusic.Areas.User.Controllers
{
    
    public class AccountMsgController : Controller
    {
        // GET: User/AccountMsg
        UserManager manager = new UserManager();
        [SigninAuthorize]
        public ActionResult SelfMsg()
        {
            return View();
        }
        public ActionResult UserMsg(int id)
        {
            var user = manager.GetUserById(id);
            return View(user);
        }
    }
}
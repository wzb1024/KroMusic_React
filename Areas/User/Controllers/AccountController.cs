using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using KroMusic.Areas.User.Models;
using BLL;
using KroMusic.Filter;
using Newtonsoft.Json;

namespace KroMusic.Areas.User.Controllers
{
    [AjaxSyncAction]
    public class AccountController : Controller
    {
        // GET: User/Account
        UserManager manager = new UserManager();
        [HttpGet]
        [AjaxSyncAction]
        public JsonResult Signin()
        {
            SigninViewModel model = new SigninViewModel();
            if (Request.Cookies["userinfo"] != null)
            {
                model.RememberMe = true;
                model.UserName = Request.Cookies["userinfo"].Values["UserName"];
                model.Password = Request.Cookies["userinfo"].Values["Password"];
            }
            else
            {
                model.RememberMe = false;
            }
            return Json(model,JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        
        public ActionResult Signin(SigninViewModel model)
        {
            LoginInfo result = new LoginInfo();
            if (ModelState.IsValid)
            {
                if (manager.Success(model.UserName, model.Password))
                {
                    if (model.RememberMe)
                    {
                        HttpCookie cookie = new HttpCookie("userinfo");
                        TimeSpan ts = new TimeSpan(7, 0, 0, 0);
                        cookie.Expires = DateTime.Now + ts;
                        cookie.Values.Add("UserName", model.UserName);
                        cookie.Values.Add("Password", model.Password);
                        Response.AppendCookie(cookie);
                    }
                    else
                    {
                        HttpCookie cok = Request.Cookies["userinfo"];
                        if (cok != null)
                        {
                            TimeSpan ts = new TimeSpan(-1, 0, 0, 0);
                            cok.Expires = DateTime.Now.Add(ts);//删除整个Cookie，只要把过期时间设置为现在
                            Response.AppendCookie(cok);
                        }
                    }
                    int id= manager.GetId(model.UserName);
                    Session["UserId"] = id;
                    var self = manager.GetUserById(id);
                    result.Status = true;
                    result.NikName = self.NickName;
                    result.Hdimg = self.Hdimage; 

                }
                else
                {
                    result.Status = false;
                    result.ErrorMsg = "用户名或密码错误！";
                }

            }
            else
            {
                result.Status = false;
                result.ErrorMsg = "用户名或密码格式错误！";
            }
            return Json(result);
        }
        [HttpGet]


        public JsonResult SigninState()
        {
            if (Session["UserId"]==null)
            {
                return Json(new { SigninSatae = false }, JsonRequestBehavior.AllowGet);
            }
            
            else
            {
                var user = manager.GetUserById(int.Parse(Session["UserId"].ToString()));
                return Json(new { SigninState = true, NikName = user.NickName, Hdimg = user.Hdimage },JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult CheckUserName(string UserName)
        {
           var user= manager.CheckName(UserName);
            if (user != null)
                return Content("用户名已被占用！");
            else
                return Content("");
        }
        [HttpGet]

        public ActionResult CheckNikName(string NickName)
        {
            if(manager.ExistNickName(NickName))
                return Content("昵称已被占用！");
            else
                return Content("");
        }
        [HttpGet]

        public ActionResult Signup()
        {
            return PartialView();
        }
        [HttpPost]

        public ActionResult Signup(HttpPostedFileBase files,SignupViewModel model)
        {
            if (ModelState.IsValid)
            {
                if(manager.CheckName(model.UserName)!=null)
                {
                    ModelState.AddModelError("", "该用户已存在！");
                    return PartialView(model);
                }
                if (manager.ExistNickName(model.NikName) )
                {
                    ModelState.AddModelError("", "该昵称已存在！");
                    return PartialView(model);
                }
                string savepath;
                if (!(files is null))
                {
                    var file = Request.Files[0];
                    string imgPath = "/Sourse/Head-image/" + Guid.NewGuid().ToString() + file.FileName;
                    savepath = Server.MapPath(imgPath);
                    file.SaveAs(savepath);
                }
                else
                {
                    savepath = "/Sourse/Head-image/default.jpg";
                }
                if (manager.Create(model.UserName,model.Password,model.NikName,model.Gender,model.Age,model.Email,savepath))
                {
                    Response.Write("<script>alert(\"注册成功!！\")</script>");
                    SigninViewModel user = new SigninViewModel() { UserName = model.UserName, Password = model.Password, RememberMe = true };
                    return PartialView("Signin", user);
                }
                else
                {
                    Response.Write("<script>alert(\"注册失败，请稍后再试！\")</script>");
                }
            }
            else
                ModelState.AddModelError("", "格式有误");
            return PartialView(model);
        }
        public ActionResult Signout()
        {
            Session.Abandon();
            return Content("已退出登录");
        }
        [HttpGet]
        [SigninAuthorize]
        public ContentResult GetAccountInfo()
        {
            int id = int.Parse(Session["UserId"].ToString());
            var model = new
            {
                State = true,
                AccountInfo = manager.GetAccountMsg(id)
            };
            var accountInfo =JsonConvert.SerializeObject( model);
            return Content(accountInfo);
        }
        [HttpPost]
        public void ChangeHdimage(HttpPostedFileBase file)
        {
            string imgPath = "/Sourse/Head-image/" + Guid.NewGuid().ToString() + file.FileName;
            string savepath = Server.MapPath(imgPath);
            file.SaveAs(savepath);
            int id = int.Parse(Session["UserId"].ToString());
            manager.ChangeHdimage(imgPath,id);
        }
        [HttpPost]
        public ActionResult ModifyMsg(ModifyMsgJsonModel model)
        {
            List<string> errorMsg = new List<string>();
            int id= int.Parse(Session["UserId"].ToString());
            if (ModelState.IsValid)
            {
                if(manager.ExistNickName(model.NickName,id))
                {
                    return Json(new { State = false, ErrorMsg = "该昵称已存在" });
                }
                else
                {
                    manager.ModifyMsg(model, id);
                    return Json(new { State =true});
                }

            }
            else
            {
                foreach(var item in ModelState.Values)
                {
                    if(item.Errors.Count>0)
                    {
                        foreach(var error in item.Errors)
                        {
                            
                           errorMsg.Add(error.ErrorMessage);
                        }
                    }
                }
                string errormsg = "";
                foreach(var item in errorMsg)
                {
                   errormsg= errormsg + item;
                }
                return Json(new { State = false, ErrorMsg = errormsg });
            }
            
        }
    }
}
﻿using BLL;
using KroMusic.Areas.User.Models;
using System;
using System.Web;
using System.Web.Mvc;

namespace KroMusic.Controllers
{
    public class SignInController : Controller
    {
        UserManager manager = new UserManager();
        [HttpGet]
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
            return Json(model, JsonRequestBehavior.AllowGet);
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
                    int id = manager.GetId(model.UserName);
                    Session["UserId"] = id;
                    var self = UserManager.GetUser(id);
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
            var self = UserManager.GetSelf();
            if (self == null)
            {
                return Json(new { SigninSatae = false }, JsonRequestBehavior.AllowGet);
            }

            else
            {

                return Json(new { SigninState = true, NikName = self.NickName, Hdimg = self.Hdimage }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult CheckUserName(string UserName)
        {
            var user = manager.CheckName(UserName);
            if (user)
                return Json(new { Msg = "用户名已被占用" }, JsonRequestBehavior.AllowGet);
            else
                return Json(new { Msg = "" }, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]

        public ActionResult CheckNickName(string NickName)
        {
            if (manager.ExistNickName(NickName))
                return Json(new { Msg = "昵称已被占用" }, JsonRequestBehavior.AllowGet);
            else
                return Json(new { Msg = "" }, JsonRequestBehavior.AllowGet);
        }
        //[HttpGet]
        //public ActionResult Signup()
        //{
        //    return PartialView();
        //}
        [HttpPost]

        public ActionResult Signup(SignupViewModel model)
        {

            if (ModelState.IsValid)
            {
                if (manager.CheckName(model.UserName))
                {
                    return Json(new
                    {
                        State = false,
                        ErrorMsg = "用户已存在"
                    });
                }
                if (manager.ExistNickName(model.NickName))
                {
                    return Json(new
                    {
                        State = false,
                        ErrorMsg = "昵称已存在"
                    });
                }
                string savepath = "/Sourse/Head-image/default.jpg";

                //var file = Request.Files[0];
                //string imgPath = "/Sourse/Head-image/" + Guid.NewGuid().ToString() + file.FileName;
                //savepath = Server.MapPath(imgPath);
                //file.SaveAs(savepath);

                if (manager.Create(model.UserName, model.Password, model.NickName, model.Gender, model.Age, model.Email, savepath))
                {
                    return Json(new
                    {
                        State = true
                    });
                }
                else
                {
                    return Json(new
                    {
                        State = false,
                        ErrorMsg = "注册失败，请稍后再试"
                    });
                }
            }
            else
            {
                string errormsg = "";
                foreach (var item in ModelState.Values)
                {
                    if (item.Errors.Count > 0)
                    {
                        foreach (var error in item.Errors)
                        {

                            errormsg += error.ErrorMessage;
                        }
                    }
                }
                return Json(new { State = false, ErrorMsg = errormsg });
            }
        }
    }
}
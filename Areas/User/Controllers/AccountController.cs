using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using KroMusic.Areas.User.Models;
using BLL;
using KroMusic.Filter;
using Newtonsoft.Json;
using System.Data.Entity;

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
        [SigninAuthorize]
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
            var accountInfo = JsonConvert.SerializeObject(model);
            return Content(accountInfo);
        }
        [HttpPost]
        [SigninAuthorize]
        public void ChangeHdimage(HttpPostedFileBase file)
        {
            string imgPath = "/Sourse/Head-image/" + Guid.NewGuid().ToString() + file.FileName;
            string savepath = Server.MapPath(imgPath);
            file.SaveAs(savepath);
            manager.ChangeHdimage(imgPath);
        }
        [HttpPost]
        [SigninAuthorize]
        public ActionResult ModifyMsg(ModifyMsgJsonModel model)
        {
            int id = int.Parse(Session["UserId"].ToString());
            if (ModelState.IsValid)
            {
                if (manager.ExistNickName(model.NickName, id))
                {
                    return Json(new { State = false, ErrorMsg = "该昵称已存在" });
                }
                else
                {
                    manager.ModifyMsg(model, id);
                    return Json(new { State = true });
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
        [SigninAuthorize]
        [HttpGet]
        public ActionResult GetSelfPlaylists()
        {
            var model = manager.GetSelfPlaylists();
            return Json(new { State = true, Model = model }, JsonRequestBehavior.AllowGet);
        }
        [SigninAuthorize]
        [HttpGet]
        public ActionResult GetFavoSongs()
        {
            var result = manager.GetFavoSongs();
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        [SigninAuthorize]
        [HttpGet]
        public ActionResult RmFavoSong(int id)
        {
            bool rm = manager.RmFavoSong(id);
            return Json(new { State = true, result = rm }, JsonRequestBehavior.AllowGet);
        }
        [SigninAuthorize]
        public ActionResult Focus(int id)
        {
            var result = manager.Focus(id);
            return Json(new { State = true, Focused = result }, JsonRequestBehavior.AllowGet);
        }
        public ActionResult GetAttention()
        {
            var result = manager.GetSingerAttention();
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        [SigninAuthorize]
        public ActionResult GetUploads()
        {

            var model1 = UserManager.GetSelf().Music.OrderByDescending(t=>t.ReleaseTime).Select(item => new { id = item.Id,key=item.Id, name = item.MusicName, singer = item.Singer.Name, createTime = item.ReleaseTime.ToString() });
            var model2 = UserManager.GetSelf().Singer.OrderByDescending(t => t.Id).Select(item => new { id = item.Id,cover=item.Image, key = item.Id, name = item.Name, });
            var results = new { songs = model1, singers = model2 };
            return Json(results, JsonRequestBehavior.AllowGet);
        }
        [SigninAuthorize]
        public ActionResult GetComAdRpl()
        {
            var data = UserManager.GetSelf().Playlist;
            var reps=UserManager.GetSelf().PlaylistComment;
            var uid = UserManager.GetSelf().Id;
            List<MessageJsonModel> msgs = new List<MessageJsonModel>();
            foreach (var item in data)
            {
                var all = item.PlaylistComment.Where(x => x.TargetId == null&&x.Visited==false&&x.UserId!=uid);
                foreach (var it in all)
                {
                    MessageJsonModel msg = new MessageJsonModel();
                    msg.Content = it.Content;
                    msg.Pid = it.PlaylistId;
                    msg.Id = it.Id;
                    msg.Img = it.User.Hdimage;
                    msg.Time = it.Time.ToString();
                    msg.NickName = it.User.NickName;
                    msg.PName = it.Playlist.Name;
                    msgs.Add(msg);
                }
            }
            List<MessageJsonModel> rpls = new List<MessageJsonModel>();
            foreach (var item in reps)
            {
                var res = item.PlaylistComment11.Where(t=>t.Visited==false&& t.UserId != uid).ToList();
                foreach (var it in res)
                {
                    MessageJsonModel msg = new MessageJsonModel();
                    msg.Content = it.Content;
                    msg.Pid = it.PlaylistId;
                    msg.Id = it.Id;
                    msg.Img = it.User.Hdimage;
                    msg.Time = it.Time.ToString();
                    msg.NickName = it.User.NickName;
                    rpls.Add(msg);
                }
            }
            return Json(new {comments=msgs,replies=rpls }, JsonRequestBehavior.AllowGet);
        }
        [SigninAuthorize]
        public ActionResult Visit(int id)
        {
            
            manager.Visit(id);
            return new EmptyResult();
        }
    }
}
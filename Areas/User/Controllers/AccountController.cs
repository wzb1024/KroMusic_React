using BLL;
using KroMusic.Filter;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace KroMusic.Areas.User.Controllers
{
    [AjaxSyncAction]
    [SigninAuthorize]
    public class AccountController : Controller
    {

        public ActionResult Signout()
        {
            Session.Clear();
            return Content("已退出登录");
        }
        // GET: User/Account
        UserManager manager = new UserManager();

        [HttpGet]
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
        public void ChangeHdimage(HttpPostedFileBase file)
        {
            string imgPath = Config.HeadImageDir + Guid.NewGuid().ToString() + file.FileName;
            string savepath = Server.MapPath(imgPath);
            file.SaveAs(savepath);
            manager.ChangeHdimage(imgPath);
        }
        [HttpPost]
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
        [HttpGet]
        public ActionResult GetSelfPlaylists()
        {
            var model = manager.GetSelfPlaylists();
            return Json(new { State = true, Model = model }, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public ActionResult GetFavoSongs()
        {
            var result = manager.GetFavoSongs();
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public ActionResult RmFavoSong(int id)
        {
            bool rm = manager.RmFavoSong(id);
            return Json(new { State = true, result = rm }, JsonRequestBehavior.AllowGet);
        }
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
        public ActionResult GetUploads()
        {

            var model1 = UserManager.GetSelf().Music.OrderByDescending(t => t.ReleaseTime).Select(item => new { id = item.Id, key = item.Id, name = item.MusicName, singer = item.Singer.Name, createTime = item.ReleaseTime.ToString() });
            var model2 = UserManager.GetSelf().Singer.OrderByDescending(t => t.Id).Select(item => new { id = item.Id, cover = item.Image, key = item.Id, name = item.Name, });
            var results = new { songs = model1, singers = model2 };
            return Json(results, JsonRequestBehavior.AllowGet);
        }
        public ActionResult GetComAdRpl()
        {
            var data = UserManager.GetSelf().Playlist;
            var reps = UserManager.GetSelf().PlaylistComment;
            var uid = UserManager.GetSelf().Id;
            List<MessageJsonModel> msgs = new List<MessageJsonModel>();
            foreach (var item in data)
            {
                var all = item.PlaylistComment.Where(x => x.TargetId == null && x.Visited == false && x.UserId != uid);
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
                var res = item.PlaylistComment11.Where(t => t.Visited == false && t.UserId != uid).ToList();
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
            return Json(new { comments = msgs, replies = rpls }, JsonRequestBehavior.AllowGet);
        }
        public ActionResult Visit(int id)
        {

            manager.Visit(id);
            return new EmptyResult();
        }
    }
}
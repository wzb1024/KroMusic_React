using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;
using Shell32;
using KroMusic.Filter;

namespace KroMusic.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return PartialView();
        }
        //private void AddMusic()
        //{

        //    string musicPath = "/Sourse/Musics/";
        //    string savepath = Server.MapPath(musicPath);
        //    DirectoryInfo lists = new DirectoryInfo(savepath);
        //    FileInfo[] mp3s = lists.GetFiles("*.mp3");
        //    foreach (var item in mp3s)
        //    {

        //        if(item.Name.Contains("[mqms2]"))
        //        {
        //            item.MoveTo(savepath+item.Name.Replace("[mqms2]",""));
        //        }
        //    }
        //}
        public ActionResult Singer()
        {
            return View();
        }
        public ActionResult Ranking()
        {
            return View();
        }
        public ActionResult Category()
        {
            return View();
        }
        public ActionResult Search()
        {
            var cok = Request.Cookies["historySearch"];
            List<string> values = new List<string>();
            if (cok != null)
            {
                foreach (var item in cok.Values.AllKeys)
                {
                    values.Add(cok.Values[item]);
                }
                ViewBag.Values = values;
            }

            return View();
        }
        [AjaxSyncAction]
        public ActionResult AddHistory(string value)
        {
            HttpCookie cookie;
            var cok = Request.Cookies["historySearch"];
            if (cok == null)
                cookie = new HttpCookie("historySearch");
            else
                cookie = cok;
            TimeSpan ts = new TimeSpan(7, 0, 0, 0);
            cookie.Expires = DateTime.Now + ts;
            cookie.Values.Add(DateTime.Now.ToString(), value);
            Response.AppendCookie(cookie);
            return new EmptyResult();
        }
        [AjaxSyncAction]
        public ActionResult Clear()
        {
            var cok = Request.Cookies["historySearch"];
            if (cok != null)
            {
                TimeSpan ts = new TimeSpan(-1, 0, 0, 0);
                cok.Expires = DateTime.Now.Add(ts);//删除整个Cookie，只要把过期时间设置为现在
                Response.AppendCookie(cok);
            }
            return new EmptyResult();
        }
        public ActionResult Error()
        {
            return View();
        }
        public ActionResult Error_404()
        {
            return Content("444444");
        }
        public ActionResult Error_500()
        {
            return Content("555555");
        }
    }
}
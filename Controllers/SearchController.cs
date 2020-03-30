using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace KroMusic.Controllers
{
    class HistoryCokyJsonmodel
    {
        public string Key { get; set; }
        public string Value { get; set; }
    }
    public class SearchController : Controller
    {
        // GET: Search
        public ActionResult GetHistory()
        {
            var cok = Request.Cookies["historySearch"];

            if (cok != null)
            {
                List<HistoryCokyJsonmodel> set = new List<HistoryCokyJsonmodel>();
                foreach (var item in cok.Values.AllKeys)
                {
                    set.Add(new HistoryCokyJsonmodel { Key = item, Value = HttpUtility.UrlDecode(cok.Values[item]) });
                }
                return Json(new { State = true, History = set }, JsonRequestBehavior.AllowGet);
            }
            else
                return Json(new { State = false }, JsonRequestBehavior.AllowGet);
        }
        public ActionResult AddHistory(string keyword)
        {
            HttpCookie cookie;
            var cok = Request.Cookies["historySearch"];
            if (cok == null)
                cookie = new HttpCookie("historySearch");
            else
                cookie = cok;
            
            cookie.Expires = DateTime.Now.AddDays(7);
            cookie.Values[HttpUtility.UrlEncode(keyword)]= HttpUtility.UrlEncode(keyword);
            Response.AppendCookie(cookie);
            return new EmptyResult();
        }
        ///// <summary>
        ///// 删除单条搜索记录
        ///// </summary>
        ///// <param name="key"></param>
        //public ActionResult Delete(string key)
        //{
        //    var cookie = Request.Cookies["historySearch"];
        //    if (cookie != null)
        //    {
        //        cookie.Values.Remove(key);
        //        //var cok= new HttpCookie("historySearch");
        //        //foreach(var item in cookie.Values.AllKeys)
        //        //{
        //        //    cok.Values[item] = cookie.Values[item];
        //        //}
        //        //cok.Expires = DateTime.Now.AddDays(7);
        //        Response.AppendCookie(cookie);
        //    }
        //    return new EmptyResult();
        //}
        /// <summary>
        /// 清除所有搜索记录
        /// </summary>
        /// <param name="key"></param>
        public ActionResult Clear()
        {

            var cookie = new HttpCookie("historySearch");

            cookie.Expires = DateTime.Now.AddDays(-1);//删除整个Cookie，只要把过期时间设置为现在
            Response.AppendCookie(cookie);

            return new EmptyResult();
        }
    }
}
using System.Web.Mvc;

namespace KroMusic.Controllers
{
    public class HomeController : Controller
    {
        [Route()]
        [Route("home")]
        [Route("playlist/{id}")]
        [Route("ranking")]
        [Route("singer/{id}")]
        [Route("category")]
        [Route("search")]
        [Route("signup")]
        [Route("song/{id}")]
        [Route("account")]
        [Route("singers")]
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
        //public ActionResult Search()
        //{
        //    var cok = Request.Cookies["historySearch"];
        //    List<string> values = new List<string>();
        //    if (cok != null)
        //    {
        //        foreach (var item in cok.Values.AllKeys)
        //        {
        //            values.Add(cok.Values[item]);
        //        }
        //        ViewBag.Values = values;
        //    }

        //    return View();
        //}
        //[AjaxSyncAction]
        //public ActionResult AddHistory(string value)
        //{
        //    HttpCookie cookie;
        //    var cok = Request.Cookies["historySearch"];
        //    if (cok == null)
        //        cookie = new HttpCookie("historySearch");
        //    else
        //        cookie = cok;
        //    TimeSpan ts = new TimeSpan(7, 0, 0, 0);
        //    cookie.Expires = DateTime.Now + ts;
        //    cookie.Values.Add(DateTime.Now.ToString(), value);
        //    Response.AppendCookie(cookie);
        //    return new EmptyResult();
        //}
        //[AjaxSyncAction]
        //public ActionResult Clear()
        //{
        //    var cok = Request.Cookies["historySearch"];
        //    if (cok != null)
        //    {
        //        TimeSpan ts = new TimeSpan(-1, 0, 0, 0);
        //        cok.Expires = DateTime.Now.Add(ts);//删除整个Cookie，只要把过期时间设置为现在
        //        Response.AppendCookie(cok);
        //    }
        //    return new EmptyResult();
        //}
    }
}
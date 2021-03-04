using BLL;
using KroMusic.Filter;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace KroMusic.Areas.Music.Controllers
{
    [AjaxSyncAction]
    public class SingerController : Controller
    {
        SingerManager manager = new SingerManager();

        public ActionResult Search(string keywords)
        {
            var results = manager.GetSingerByKeywords(keywords);
            List<SearchResultItemJsonModel> data = new List<SearchResultItemJsonModel>();
            if (results != null)
                foreach (var item in results)
                {
                    SearchResultItemJsonModel u = new SearchResultItemJsonModel() { Id = item.Id, Name = item.Name, Owner = item.Image };
                    data.Add(u);
                }
            return Json(data, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetDetails(int id)
        {
            var data = manager.GetDetails(id);
            return Json(data, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetSongs(int id)
        {
            var data = manager.GetSongs(id);
            return Json(data, JsonRequestBehavior.AllowGet);
        }
        public ActionResult Create(string name, string nationality, string gender, int age, HttpPostedFileBase file)
        {
            manager.Create(name, nationality, gender, age, file);
            return new EmptyResult();
        }
        public ActionResult GetPopSingers()
        {
            var data = manager.GetPopSingers();
            return Json(data, JsonRequestBehavior.AllowGet);
        }
        public ActionResult GetSingers(string gender,string region)
        {
            var data = manager.GetAllSingers();
            if (gender!="全部")           data = data.Where(u => u.Gender==gender);

            if (region != "全部") data = data.Where(u => u.Nationality == region);
             var re =data.Select(n => new { Id = n.Id, Name = n.Name, Image = n.Image });
            return Json(re, JsonRequestBehavior.AllowGet);
        }
    }
}
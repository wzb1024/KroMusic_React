using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using KroMusic.Filter;
using BLL;
using KroMusic.Areas.Music.Data;

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
                    SearchResultItemJsonModel u = new SearchResultItemJsonModel() {Id=item.Id, Name = item.Name,Owner = item.Image };
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

    }
}
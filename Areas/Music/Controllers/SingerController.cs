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
    public class SingerController : Controller
    {
        SingerManager manager = new SingerManager();
        [AjaxSyncAction]
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
    }
}
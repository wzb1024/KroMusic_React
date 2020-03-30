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
            List<SearchResultModel> data = new List<SearchResultModel>();
            if (results != null)
                foreach (var item in results)
                {
                    SearchResultModel u = new SearchResultModel() {Id=item.Id, Name = item.Name,Owner = item.Image };
                    data.Add(u);
                }
            return Json(data, JsonRequestBehavior.AllowGet);
        }
        public ActionResult SingerDetails(int id)
        {
            var model = manager.GetById(id);
            return View(model);
        }
    }
}
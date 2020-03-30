using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using BLL;
using KroMusic.Areas.Music.Data;
using KroMusic.Filter;

namespace KroMusic.Areas.Music.Controllers
{
    public class SongController : Controller
    {
        // GET: Music/Song

        MusicManager manager = new MusicManager();
        [AjaxSyncAction]
        public ActionResult Search(string keywords)
        {
            var results = manager.GetMusicsByKeywords(keywords);
            List<SearchResultModel> data = new List<SearchResultModel>();
            if (results != null)
                foreach (var item in results)
                {
                    SearchResultModel u = new SearchResultModel() { Id = item.Id, Name = item.MusicName, Owner = item.Singer.Name };
                    data.Add(u);
                }
            return Json(data, JsonRequestBehavior.AllowGet);
        }
        public ActionResult MusicDetails(int id)
        {
            var model = manager.GetById(id);
            return View(model);
        }
        /// <summary>
        /// 歌曲加入我喜欢
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [AjaxSyncAction]
        [SigninAuthorize]
        public ActionResult MusicCollect(int id)
        {
            int userId = int.Parse(Session["UserId"].ToString());
            bool result = manager.Collect(id, userId);
            return Content(result.ToString());
        }
        /// <summary>
        /// 歌曲点赞
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [AjaxSyncAction]
        [SigninAuthorize]
        public ActionResult MusicLike(int id)
        {
            int userId = int.Parse(Session["UserId"].ToString());
            bool result = manager.Like(id, userId);
            return Content(result.ToString());
        }
    }
}
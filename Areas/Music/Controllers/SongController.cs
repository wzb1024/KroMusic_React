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
    [AjaxSyncAction]
    public class SongController : Controller
    {
        // GET: Music/Song

        MusicManager manager = new MusicManager();
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
            var model = manager.GetMusicById(id);
            return View(model);
        }
        /// <summary>
        /// 歌曲加入我喜欢
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [SigninAuthorize]
        public ActionResult MusicCollect(int id)
        {         
            bool result = manager.Collect(id);
            return Content(result.ToString());
        }
        /// <summary>
        /// 歌曲点赞
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [SigninAuthorize]
        public ActionResult MusicLike(int id)
        {           
            bool result = manager.Like(id);
            return Content(result.ToString());
        }
        /// <summary>
        /// 获取播放列表歌曲
        /// </summary>
        /// <param name="list"></param>
        /// <returns></returns>
        public ActionResult GetSongsList(List<int> list)
        {
            var model = manager.GetSongsList(list);
            return Json(model,JsonRequestBehavior.AllowGet);
        }
    }
}
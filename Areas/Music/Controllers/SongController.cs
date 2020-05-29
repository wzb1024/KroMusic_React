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
            var data = manager.GetMusicsByKeywords(keywords);

               
            return Json(data, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult AddToPlaylist(int mid,int pid)
        {
            bool suc = manager.AddToPlaylist(mid,pid);
            return Json(new { State = suc });
        }
        public ActionResult GetSongDetails(int id)
        {
            var model = manager.GetSongDetails(id);
            return Json(model,JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 歌曲加入我喜欢
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [SigninAuthorize]
        public ActionResult SongCollect(int id)
        {         
            var result = manager.Collect(id);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 歌曲点赞
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [SigninAuthorize]
        public ActionResult SongLike(int id)
        {           
            var  result = manager.Like(id);
            return Json(result, JsonRequestBehavior.AllowGet);
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
        /// <summary>
        /// 获取评论
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult GetComments(int id)
        {
            var result = manager.GetComments(id);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        [SigninAuthorize]
        [HttpPost]
        public ActionResult Comment(int id, string value)
        {

            var model = manager.Comment(id, value);
            var result = new
            {
                State = true,
                Model = model
            };
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        [SigninAuthorize]
        [HttpPost]
        public ActionResult Reply(int id, string value, int targetId)
        {

            var model = manager.Reply(id, value, targetId);
            var result = new
            {
                State = true,
                Model = model
            };
            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}
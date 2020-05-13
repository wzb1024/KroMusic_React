﻿using System;
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
            List<SearchResultItemJsonModel> data = new List<SearchResultItemJsonModel>();
            if (results != null)
                foreach (var item in results)
                {
                    SearchResultItemJsonModel u = new SearchResultItemJsonModel() { Id = item.Id, Name = item.MusicName, Owner = item.Singer.Name };
                    data.Add(u);
                }
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
    }
}
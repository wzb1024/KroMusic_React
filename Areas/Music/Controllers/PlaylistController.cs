using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using KroMusic.Filter;
using BLL;
using KroMusic.Areas.Music.Data;
using Model;
using Newtonsoft.Json;

namespace KroMusic.Areas.Music.Controllers
{

    [AjaxSyncAction]
    public class PlaylistController : Controller
    {

        PlaylistManager manager = new PlaylistManager();
        CategoryManager categoryManager = new CategoryManager();
        FavoritePlaylistManager Favorite = new FavoritePlaylistManager();
        public ActionResult RcmdList()
        {
            return View();
        }

        public ActionResult Search(string keywords)
        {
            var result = manager.GetPlaylistsByKeywords(keywords);
            List<SearchResultModel> data = new List<SearchResultModel>();
            if (result != null)
                foreach (var item in result)
                {
                    SearchResultModel u = new SearchResultModel() { Id = item.Id, Name = item.Name, Owner = item.User.NickName };
                    data.Add(u);
                }
            return Json(data, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// json格式返回全部分类
        /// </summary>
        /// <returns></returns>
        public JsonResult GetCategories()
        {
            var all = categoryManager.GetAllCategories();

            return Json(all, JsonRequestBehavior.AllowGet);

        }
        /// <summary>
        /// 获取某类型的指定页公开歌单
        /// </summary>
        /// <param name="order"></param>
        /// <param name="Id"></param>
        /// <returns></returns>
        public JsonResult GetPlaylists(int id, int pageIndex, bool orderByHeat)
        {
            int pageSize = 15;
            var data = manager.GetPlaylistsByType(id, orderByHeat, pageIndex, pageSize);
            return Json(data, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 获取歌单具体内容
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ContentResult PlaylistDetails(int id)
        {
            var model = JsonConvert.SerializeObject(manager.GetPlaylist(id));
            return Content(model);
        }
        /// <summary>
        /// 收藏歌单
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [SigninAuthorize]
        public JsonResult PlaylistCollect(int id)
        {
            int userId = int.Parse(Session["UserId"].ToString());
            var result = manager.Collect(id, userId);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 歌单点赞
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [SigninAuthorize]
        public JsonResult PlaylistLike(int id)
        {
            int userId = int.Parse(Session["UserId"].ToString());
            var result = manager.Like(id, userId);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 批量取消收藏歌单
        /// </summary>
        /// <returns></returns>
        [SigninAuthorize]
        public ActionResult CancelCollectPlaylists(List<int> playlists)
        {
            int userId = int.Parse(Session["UserId"].ToString());
            Favorite.CancelCollectPlaylists(playlists, userId);
            var model = new
            {
                State = true,
                Playlists = manager.GetFavoritePlaylists(userId)

            };

            return Json(model, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 获取用户收藏歌单
        /// </summary>
        /// <returns></returns>
        [SigninAuthorize]
        public ActionResult GetFavoritePlaylists()
        {
            int userId = int.Parse(Session["UserId"].ToString());
            var model = new
            {
                State = true,
                Playlists = manager.GetFavoritePlaylists(userId)
            };
            return Json(model, JsonRequestBehavior.AllowGet);
        }
    }
}
using BLL;
using KroMusic.Filter;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Web;
using System.Web.Mvc;

namespace KroMusic.Areas.Music.Controllers
{

    [AjaxSyncAction]
    public class PlaylistController : Controller
    {
        PlaylistManager manager = new PlaylistManager();
        CategoryManager categoryManager = new CategoryManager();
        public ActionResult RcmdList()
        {
            return View();
        }
        public ActionResult Search(string keywords, int pageIndex)
        {
            int pageSize = 15;
            var result = manager.GetPlaylistsByKeywords(keywords, pageIndex, pageSize);
            return Json(result, JsonRequestBehavior.AllowGet);
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
            int pageSize = 12;
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
            var model = JsonConvert.SerializeObject(manager.GetPlaylistJson(id));
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
            var result = manager.Collect(id);
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

            var result = manager.Like(id);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 批量取消收藏歌单
        /// </summary>
        /// <returns></returns>
        [SigninAuthorize]
        public ActionResult CancelCollectPlaylists(List<int> playlists)
        {

            manager.CancelCollectPlaylists(playlists);
            var model = new
            {
                State = true,
                Playlists = manager.GetFavoritePlaylists()

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
            var model = new
            {
                State = true,
                Playlists = manager.GetFavoritePlaylists()
            };
            return Json(model, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 获取歌单的歌曲
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult GetSongs(int id)
        {
            var model = manager.GetSongList(id);
            return Json(model, JsonRequestBehavior.AllowGet);
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

        [SigninAuthorize]
        [HttpPost]
        public ActionResult CreatePlaylist(string name)
        {
            var model = manager.CreatePlaylist(name);
            if (model == null)
            {
                var result = new
                {
                    State = false,
                    ErrorMsg = "创建失败，有同名歌单"
                };
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            else
            {
                var result = new
                {
                    State = true,
                    Model = model
                };
                return Json(result, JsonRequestBehavior.AllowGet);
            }

        }
        [SigninAuthorize]
        public ActionResult DelPlaylist(int id)
        {
            bool result = manager.DelPlaylist(id);
            return Json(new { State = result }, JsonRequestBehavior.AllowGet);
        }
        [SigninAuthorize]
        [HttpPost]
        public ActionResult RmItems(int[] items)
        {
            manager.RmItems(items);
            return new EmptyResult();
        }
        [AjaxSyncAction]
        public ActionResult Play(int id)
        {
            var p = manager.GetPlaylist(id, false);
            p.PlayTimes++;
            manager.saveChanges();
            return new EmptyResult();
        }
        [SigninAuthorize]
        [HttpPost]
        public ActionResult ModifyPlaylist(HttpPostedFileBase cover)
        {
            var id = int.Parse(Request["Id"]);
            var desc = Request["Description"];
            var tags = Request["Tags"];
            var isPublic = bool.Parse(Request["IsPublic"]);
            var name = Request["Name"];
            manager.Modify(id, desc, tags, isPublic, name, cover);

            return new EmptyResult();
        }
        [AjaxSyncAction]
        public ActionResult GetReco()
        {
            var result = manager.GetReco();
            return Json(result, JsonRequestBehavior.AllowGet);
        }

    }
}
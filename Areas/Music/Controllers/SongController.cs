using BLL;
using KroMusic.Filter;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

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
        public ActionResult AddToPlaylist(int mid, int pid)
        {
            bool suc = manager.AddToPlaylist(mid, pid);
            return Json(new { State = suc });
        }
        public ActionResult GetSongDetails(int id)
        {
            var model = manager.GetSongDetails(id);
            return Json(model, JsonRequestBehavior.AllowGet);
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
            var result = manager.Like(id);
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
        public ActionResult Upload(HttpPostedFileBase file, string singer, string title)
        {
            var existSong = manager.ExistSong(title, singer);
            if (existSong) return Json(new { singer = true, song = true }, JsonRequestBehavior.AllowGet);
            else
            {
                var existSinger = manager.ExistSinger(singer);
                if (existSinger)
                {
                    manager.Create(title, singer, file);
                    return Json(new { singer = true, song = false }, JsonRequestBehavior.AllowGet);
                }

                else return Json(new { singer = false, song = false }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult Play(int id)
        {

            var p = manager.GetSong(id, false);
            p.PlayTimes++;
            manager.saveChanges();
            return new EmptyResult();
        }
        public ActionResult GetPopSongs(int? count)
        {
            
            if(count!=null)
            {
                int c = int.Parse(count.ToString());
                var data = manager.GetAllSongs().OrderByDescending(u => u.LikeMusic.Count()).Take(c).Select(n => new { Id = n.Id, MusicName = n.MusicName, Singer = n.Singer.Name,Span=n.Span });
                      return Json(data, JsonRequestBehavior.AllowGet);
            }
            else
            {
                var data = manager.GetAllSongs().OrderByDescending(u => u.LikeMusic.Count()).Select(n => new { Id = n.Id, MusicName = n.MusicName, Singer = n.Singer.Name, Span = n.Span });
                return Json(data, JsonRequestBehavior.AllowGet);
            }
          
        }
        public ActionResult GetHeatSongs()
        {

                var data = manager.GetAllSongs().OrderByDescending(u => u.PlayTimes).Select(n => new { Id = n.Id, MusicName = n.MusicName, Singer = n.Singer.Name, Span = n.Span });
                return Json(data, JsonRequestBehavior.AllowGet);
            

        }
        public ActionResult GetNewSongs(int? count)
        {
            if (count != null)
            {
                int c = int.Parse(count.ToString());
                var data = manager.GetAllSongs().OrderByDescending(u => u.ReleaseTime).Take(c).Select(n => new { Id = n.Id, MusicName = n.MusicName, Singer = n.Singer.Name, Span = n.Span });
                return Json(data, JsonRequestBehavior.AllowGet);
            }
            else
            {
                var data = manager.GetAllSongs().OrderByDescending(u => u.ReleaseTime).Select(n => new { Id = n.Id, MusicName = n.MusicName, Singer = n.Singer.Name, Span = n.Span });
                return Json(data, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult GetRegionSongs(string region,int?count)
        {
            if (count != null)
            {
                int c = int.Parse(count.ToString());
                var data = manager.GetAllSongs().OrderByDescending(x => x.Singer.Nationality == region).Take(c).Select(n => new { Id = n.Id, MusicName = n.MusicName, Singer = n.Singer.Name, Span = n.Span });
                return Json(data, JsonRequestBehavior.AllowGet);
            }
            else
            {
                var data = manager.GetAllSongs().OrderByDescending(x => x.Singer.Nationality == region).Select(n => new { Id = n.Id, MusicName = n.MusicName, Singer = n.Singer.Name, Span = n.Span });
                return Json(data, JsonRequestBehavior.AllowGet);
            }
        }

    }
}
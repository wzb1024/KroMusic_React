using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model;
using DAL;
using System.Web;
using IDAL;

namespace BLL
{
    public class SongJsonModel
    {
        public int Id { get; set; }
        public string MusicName { get; set; }
        public string SingerName { get; set; }
        public string Path { get; set; }
        public string ImagePath { get; set; }
        public string Span { get; set; }
        public bool Favorite { get; set; } = false;
    }
    public class MusicManager
    {
        //private MusicManager() { }                                       //单例模式
        //private static MusicManager instance = new MusicManager();
        //public static MusicManager Instance { get { return instance; } }

        IMusicService service = DALFactory.DataAccess.CreateMusicService();
        KroMusicEntities entities = DBContextFactory.GetContext();


        string userId = HttpContext.Current.Session["UserId"] == null ? null : HttpContext.Current.Session["UserId"].ToString();
        public Music GetMusicById(int id)
        {
            return service.GetById(id);
        }
        public List<Music> GetMusicsByKeywords(string keywords)
        {
            return service.GetAllAsNoTracking().Where(u => u.MusicName.Contains(keywords)).ToList<Music>();
        }
        public bool Collect(int musicId)
        {
            int uid = int.Parse(userId);
            var e = entities.Set<FavoriteMusic>().FirstOrDefault(u => u.MusicId== musicId && u.UserId == uid);
            if (e == null)
            {
                FavoriteMusic s = new FavoriteMusic();
                s.UserId = uid;
                s.MusicId = musicId;
                entities.Set<FavoriteMusic>().Add(s);
                entities.SaveChanges();
                return true;
            }
            else
            {
                entities.Set<FavoriteMusic>().Remove(e);
                entities.SaveChanges();
                return false;
            }
        }
        public bool Like(int musicId)
        {
            int uid = int.Parse(userId);
            var e = entities.Set<LikeMusic>().FirstOrDefault(u => u.MusicId == musicId && u.UserId == uid);
            var n = service.GetById(musicId);
            if (e == null)
            {
                LikeMusic s = new LikeMusic();
                s.UserId = uid;
                s.MusicId = musicId;
                s.Time = DateTime.Now;
                entities.Set<LikeMusic>().Add(s);
                entities.SaveChanges();
                n.Likes = n.LikeMusic.Count();
                service.Edit(n);
                return true;
            }
            else
            {
                entities.Set<LikeMusic>().Remove(e);
                entities.SaveChanges();
                n.Likes = n.LikeMusic.Count();
                service.Edit(n);
                return false;
            }
        }
        public List<SongJsonModel> GetSongsList(List<int> list)
        {
            List<SongJsonModel> mlist = new List<SongJsonModel>();
            foreach (var item in list)
            {
                var m = service.GetByIdAsNoTracking(item);
                SongJsonModel u = new SongJsonModel
                {
                    Id = m.Id,
                    ImagePath = m.ImagePath,
                    MusicName = m.MusicName,
                    Path = m.Path,
                    SingerName = m.Singer.Name,
                    Span = m.Span.TotalSeconds.ToString()
                };
                mlist.Add(u);
            }
            return mlist;

        }
    }
}

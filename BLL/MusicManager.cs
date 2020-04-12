using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model;
using DAL;

namespace BLL
{
    public class MusicJsonModel
    {
        public int Id { get; set; }
        public string MusicName { get; set; }
        public string SingerName { get; set; }
        public string Path { get; set; }
        public string ImagePath { get; set; }
        public string Span { get; set; }
    }
    public class MusicManager:BaseManager<Music>
    {
        KroMusicEntities entities = new KroMusicEntities();
        public override BaseService<Music> GetDAL()
        {
            return new MusicService(entities);
        }
        public List<Music> GetMusicsByKeywords(string keywords)
        {
            return GetAllAsNoTracking().Where(u => u.MusicName.Contains(keywords)).ToList<Music>();
        }
        public bool Collect(int musicId, int userId)
        {
            var e = entities.Set<FavoriteMusic>().FirstOrDefault(u => u.MusicId== musicId && u.UserId == userId);
            if (e == null)
            {
                FavoriteMusic s = new FavoriteMusic();
                s.UserId = userId;
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
        public bool Like(int musicId, int userId)
        {
            var e = entities.Set<LikeMusic>().FirstOrDefault(u => u.MusicId == musicId && u.UserId == userId);
            var n = GetById(musicId);
            if (e == null)
            {
                LikeMusic s = new LikeMusic();
                s.UserId = userId;
                s.MusicId = musicId;
                s.Time = DateTime.Now;
                entities.Set<LikeMusic>().Add(s);
                entities.SaveChanges();
                n.Likes = n.LikeMusic.Count();
                Edit(n);
                return true;
            }
            else
            {
                entities.Set<LikeMusic>().Remove(e);
                entities.SaveChanges();
                n.Likes = n.LikeMusic.Count();
                Edit(n);
                return false;
            }
        }
    }
}

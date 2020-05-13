﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model;
using DAL;
using System.Web;
using IDAL;
using System.Security;

namespace BLL
{

    public class MusicManager
    {
        //private MusicManager() { }                                       //单例模式
        //private static MusicManager instance = new MusicManager();
        //public static MusicManager Instance { get { return instance; } }

        IMusicService service = DALFactory.DataAccess.CreateMusicService();
        KroMusicEntities entities = DBContextFactory.GetContext();


        string userId = HttpContext.Current.Session["UserId"] == null ? null : HttpContext.Current.Session["UserId"].ToString();
        SongJsonModel Convert(Music s)
        {
            SongJsonModel t = new SongJsonModel();
            List<String> subs = new List<string>();
            foreach (var item in s.MusicType)
            {
                subs.Add(item.SubType.Name);
            }
            t.Tags = subs;
            t.PlayTimes = s.PlayTimes;
            t.Lyric = s.Lyric;
            t.SingerId = s.SingerId;
            t.SingerName = s.Singer.Name;
            t.Id = s.Id;
            t.ImagePath = s.ImagePath;
            t.MusicName = s.MusicName;
            t.Region = s.Region;
            t.ReleaseTime = s.ReleaseTime.ToShortDateString();
            if (userId != null)
            {
                int uid = int.Parse(userId);
                t.Favorite = s.FavoriteMusic.Any(it => it.UserId == uid);
                t.Like = s.LikeMusic.Any(it => it.UserId == uid);
            }
            return t;
        }
        /// <summary>
        /// 获取歌曲资料及其相关歌曲
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public List<SongJsonModel> GetSongDetails(int id)
        {
            HashSet<SongJsonModel> model = new HashSet<SongJsonModel>();
            var m= service.GetById(id);
            var v = Convert(m);
            model.Add(v);
            var relate = service.GetAllAsNoTracking().Where(it => it.MusicType.Any(i => v.Tags.Contains(i.SubType.Name)));
            foreach (var item in relate)
            {
                var i = Convert(item);
                model.Add(i);
                if (model.Count == 6) break;
            }
            return new List<SongJsonModel>(model);

        }
        public List<Music> GetMusicsByKeywords(string keywords)
        {
            return service.GetAllAsNoTracking().Where(u => u.MusicName.Contains(keywords)).ToList<Music>();
        }
        public CollectJsonModel Collect(int musicId)
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
                return new CollectJsonModel {State=true, Collected = true, Message = "已添加" };
            }
            else
            {
                entities.Set<FavoriteMusic>().Remove(e);
                entities.SaveChanges();
                return new CollectJsonModel { State = true, Collected = false, Message = "已取消" };
            }
        }
        public LikeJsonModel Like(int musicId)
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
                return new LikeJsonModel { State = true, Like = true, Message = "点赞成功" };
            }
            else
            {
                entities.Set<LikeMusic>().Remove(e);
                entities.SaveChanges();
                n.Likes = n.LikeMusic.Count();
                service.Edit(n);
                return new LikeJsonModel { State = true, Like = false, Message = "取消点赞" };
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
                if (userId != null)
                {
                    int uid = int.Parse(userId);
                    u.Favorite = m.FavoriteMusic.Any(it => it.UserId == uid);
                }
                mlist.Add(u);
            }
            return mlist;
        }
        public bool AddToPlaylist(int mid,int pid)
        {
            var sev = DALFactory.DataAccess.CreatePlaylistItemService();
            bool exist = sev.GetAllAsNoTracking().FirstOrDefault(i => i.MusicId == mid && i.PlaylistId == pid)!=null;
            if (exist) return false;
            else
            {
                PlaylistItem item = new PlaylistItem();
                item.PlaylistId = pid;
                item.MusicId = mid;
                sev.Create(item);
                return true;
            }
        }
    }
}

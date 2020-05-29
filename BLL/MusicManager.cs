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

        IMusicService service = DALFactory.DataAccess.CreateMusicService();
       


        SongJsonModel Convert(Music s)
        {
            var self = UserManager.GetSelf();
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
            if (self != null)
            {
      
                t.Favorite = s.FavoriteMusic.Any(it => it.UserId == self.Id);
                t.Like = s.LikeMusic.Any(it => it.UserId == self.Id);
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
        public List<SearchResultItemJsonModel> GetMusicsByKeywords(string keywords)
        {
            var results=service.GetAllAsNoTracking().Where(u => u.MusicName.Contains(keywords)||keywords.Contains(u.MusicName)).ToList<Music>();
            List<SearchResultItemJsonModel> data = new List<SearchResultItemJsonModel>();
            foreach (var item in results)
            {
                SearchResultItemJsonModel u = new SearchResultItemJsonModel() { Id = item.Id, Name = item.MusicName, Owner = item.Singer.Name };
                data.Add(u);
            }
            return data;
        }
        public CollectJsonModel Collect(int musicId)
        {
            var self = UserManager.GetSelf();
            var e = self.FavoriteMusic.FirstOrDefault(u => u.MusicId== musicId );
            if (e == null)
            {
                FavoriteMusic s = new FavoriteMusic();
                s.UserId = self.Id;
                s.MusicId = musicId;
                self.FavoriteMusic.Add(s);
                DBContextFactory.Context.SaveChanges();
                return new CollectJsonModel {State=true, Collected = true, Message = "已添加" };
            }
            else
            {
                self.FavoriteMusic.Remove(e);
                DBContextFactory.Context.SaveChanges();
                return new CollectJsonModel { State = true, Collected = false, Message = "已取消" };
            }
        }
        public LikeJsonModel Like(int musicId)
        {
            var self = UserManager.GetSelf();
            var e = self.LikeMusic.FirstOrDefault(u => u.MusicId == musicId );
            var n = service.GetById(musicId);
            if (e == null)
            {
                LikeMusic s = new LikeMusic();
                s.UserId = self.Id;
                s.MusicId = musicId;
                s.Time = DateTime.Now;
                self.LikeMusic.Add(s);
                DBContextFactory.Context.SaveChanges();
                n.Likes = n.LikeMusic.Count();
                service.Edit(n);
                return new LikeJsonModel { State = true, Like = true, Message = "点赞成功" };
            }
            else
            {
                self.LikeMusic.Remove(e);
                DBContextFactory.Context.SaveChanges();
                n.Likes = n.LikeMusic.Count();
                service.Edit(n);
                return new LikeJsonModel { State = true, Like = false, Message = "取消点赞" };
            }
        }
        public List<SongJsonModel> GetSongsList(List<int> list)
        {
            List<SongJsonModel> mlist = new List<SongJsonModel>();
            var self = UserManager.GetSelf();
            foreach (var item in list)
            {
                var m = service.GetByIdAsNoTracking(item);
                SongJsonModel u = new SongJsonModel();
                u.Id = m.Id;
                u.ImagePath = m.ImagePath;
                u.MusicName = m.MusicName;
                u.Path = m.Path;
                u.SingerName = m.Singer.Name;
                var sp= m.Span.Split(':');
                int min = int.Parse(sp[1]);
                int se = int.Parse(sp[2]);
                u.Span = (min*60+se).ToString();
                if (self != null)
                {
                    
                    u.Favorite = m.FavoriteMusic.Any(it => it.UserId == self.Id);
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
        public List<CommentJsonModel> GetComments(int id)
        {
            List<CommentJsonModel> Result = new List<CommentJsonModel>();
            Music model = service.GetByIdAsNoTracking(id);
            var Comments = model.MusicComment.Where(m => m.TargetId == null).OrderByDescending(i => i.Time).ToList();
            foreach (var item in Comments)
            {
                CommentJsonModel u = new CommentJsonModel();
                u.Id = item.Id;
                u.Content = item.Content;
                u.UserId = item.UserId;
                u.NickName = item.User.NickName;
                u.Hdimg = item.User.Hdimage;
                u.Time = item.Time.ToString();
                List<SubCommentJsonModel> subComments = new List<SubCommentJsonModel>();
                var n = model.MusicComment.Where(m => m.ReplyId == item.Id).OrderByDescending(i => i.Time).ToList();
                foreach (var it in n)
                {
                    SubCommentJsonModel sub = new SubCommentJsonModel();
                    var target = it.MusicComment3;
                    sub.Id = it.Id;
                    sub.TarUserId = target.UserId;
                    sub.UserId = it.UserId;
                    sub.NickName = it.User.NickName;
                    sub.TarHdimg = target.User.Hdimage;
                    sub.Hdimg = it.User.Hdimage;
                    sub.Time = it.Time.ToString();
                    sub.TarName = target.User.NickName;
                    sub.Content = it.Content;
                    sub.TargetId = int.Parse(it.TargetId.ToString());
                    subComments.Add(sub);
                }
                u.SubComments = subComments;
                Result.Add(u);
            }
            return Result;
        }
        public CommentJsonModel Comment(int id, string value)
        {
            var userId = UserManager.GetSelf().Id;
            var s = DALFactory.DataAccess.CreateMusicCommentService();
            MusicComment comment = new MusicComment();
            comment.Content = value;
            comment.MusicId = id;
            comment.UserId = userId;
            comment.Time = DateTime.Now;
            s.Create(comment);
            comment = s.GetByIdAsNoTracking(comment.Id);
            CommentJsonModel model = new CommentJsonModel
            {
                UserId = userId,
                Id = comment.Id,
                Content = value,
                Hdimg = comment.User.Hdimage,
                NickName = comment.User.NickName,
                Time = comment.Time.ToString(),
                SubComments = new List<SubCommentJsonModel>()
            };

            return model;
        }
        public SubCommentJsonModel Reply(int id, string value, int targetId)
        {
            var userId = UserManager.GetSelf().Id;
            var s = DALFactory.DataAccess.CreateMusicCommentService();
            var target = s.GetByIdAsNoTracking(targetId);
            MusicComment comment = new MusicComment();
            comment.Content = value;
            comment.MusicId = id;
            comment.UserId = userId;
            comment.Time = DateTime.Now;
            comment.TargetId = targetId;
            if (target.ReplyId != null)
            {
                comment.ReplyId = target.ReplyId;
            }
            else
            {
                comment.ReplyId = target.Id;
            }
            s.Create(comment);
            comment = s.GetByIdAsNoTracking(comment.Id);
            SubCommentJsonModel model = new SubCommentJsonModel();
            model.UserId = userId;
            model.Id = comment.Id;
            model.Content = value;
            model.Hdimg = comment.User.Hdimage;
            model.NickName = comment.User.NickName;
            model.Time = comment.Time.ToString();
            model.TarName = target.User.NickName;
            model.TarUserId = target.User.Id;
            model.TarHdimg = target.User.Hdimage;
            model.TargetId = target.Id;
            return model;
        }
    }
}

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Security.Cryptography;
using System.Web;
using DAL;
using IDAL;
using Model;

namespace BLL
{

    public class PlaylistManager
    {
        //单例模式
        //private PlaylistManager()
        //{

        //}
        //private static PlaylistManager instance = new PlaylistManager();
        //public static PlaylistManager Instance { get { return instance; } }

        IPlaylistService service = DALFactory.DataAccess.CreatePlaylistService();

        KroMusicEntities entities = DBContextFactory.GetContext();
        string userId = HttpContext.Current.Session["UserId"] == null ? null : HttpContext.Current.Session["UserId"].ToString();

        public SearchResultJsonModel GetPlaylistsByKeywords(string keywords, int pageIndex, int pageSize)
        {
            var model = new SearchResultJsonModel();
            var query = service.GetAllAsNoTracking().Where(u => u.Name.Contains(keywords));
            var result = query.OrderByDescending(i => i.PlayTimes).Skip((pageIndex - 1) * pageSize).Take(pageSize).ToList();
            model.Total = query.Count();
            List<SearchResultItemJsonModel> data = new List<SearchResultItemJsonModel>();
            foreach (var item in result)
            {
                SearchResultItemJsonModel u = new SearchResultItemJsonModel() { Id = item.Id, Name = item.Name, Owner = item.User.NickName };
                data.Add(u);
            }
            model.List = data;
            return model;

        }
        /// <summary>
        /// 获取某类型的全部公开歌单
        /// </summary>
        /// <param name="order"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public PlaylistCardsJsonModel GetPlaylistsByType(int id, bool orderByHeat, int pageIndex, int pageSize)
        {
            PlaylistCardsJsonModel data = new PlaylistCardsJsonModel();
            List<Playlist> model;
            List<PlaylistCardJsonModel> card = new List<PlaylistCardJsonModel>();

            if (id == 0)
            {
                var these = service.GetAllAsNoTracking().Where(u => u.IsPublic);
                data.Total = these.Count();
                if (orderByHeat)

                    model = these.OrderByDescending(u => u.PlayTimes).Skip((pageIndex - 1) * pageSize).Take(pageSize).ToList();

                else
                    model = these.OrderByDescending(u => u.CreateTime).Skip((pageIndex - 1) * pageSize).Take(pageSize).ToList();
            }
            else
            {
                var these = service.GetAll().Where(u => u.IsPublic && u.PlaylistType.Any(n => n.SubTypeId == id));
                data.Total = these.Count();

                if (orderByHeat)
                    model = these.OrderByDescending(u => u.PlayTimes).Skip((pageIndex - 1) * pageSize).Take(pageSize).ToList();
                else
                    model = these.OrderByDescending(u => u.CreateTime).Skip((pageIndex - 1) * pageSize).Take(pageSize).ToList();
            }
            foreach (var item in model)
            {
                var u = new PlaylistCardJsonModel();
                u.Id = item.Id;
                u.OwnerId = item.OwnerId;
                u.Cover = item.Cover;
                u.PlayTimes = item.PlayTimes;
                u.NikName = item.User.NickName;
                u.Name = item.Name;
                card.Add(u);
            }
            data.Playlists = card;
            return data;
        }
        public PlaylistJsonModel GetPlaylist(int id)
        {
            var model = service.GetById(id);
            List<String> subs = new List<string>();
            PlaylistJsonModel jsonModel = new PlaylistJsonModel
            {
                Id = model.Id,
                OwnerId = model.OwnerId,
                Cover = model.Cover,
                Likes = model.Likes,
                PlayTimes = model.PlayTimes,
                Description = model.Description,
                CreateTime = model.CreateTime.ToShortDateString(),
                Name = model.Name,
                NickName = model.User.NickName,
            };
            if (userId != null)
            {
                int uid = int.Parse(userId);
                jsonModel.IsCollected = model.FavoritePlaylist.Any(item => item.UserId == uid);
                jsonModel.IsLiked = model.LikePlaylist.Any(item => item.UserId == uid);
            }
            foreach (var item in model.PlaylistType)
            {
                subs.Add(item.SubType.Name);
            }
            jsonModel.Tags = subs;
            return jsonModel;
        }
        public CollectJsonModel Collect(int playlistId)
        {
            int uid = int.Parse(userId);
            var e = entities.FavoritePlaylist.FirstOrDefault(u => u.PlaylistId == playlistId && u.UserId == uid);
            if (e == null)
            {
                FavoritePlaylist s = new FavoritePlaylist();
                s.UserId = uid;
                s.PlaylistId = playlistId;
                entities.Set<FavoritePlaylist>().Add(s);
                entities.SaveChanges();
                return new CollectJsonModel { Collected = true, Message = "收藏成功" };
            }
            else
            {
                entities.Set<FavoritePlaylist>().Remove(e);
                entities.SaveChanges();
                return new CollectJsonModel { Collected = false, Message = "取消收藏" };
            }
        }
        public LikeJsonModel Like(int playlistId)
        {
            int uid = int.Parse(userId);
            var e = entities.Set<LikePlaylist>().FirstOrDefault(u => u.PlaylistId == playlistId && u.UserId == uid);
            var n = service.GetById(playlistId);
            if (e == null)
            {
                LikePlaylist s = new LikePlaylist();
                s.UserId = uid;
                s.PlaylistId = playlistId;
                s.Time = DateTime.Now;
                entities.Set<LikePlaylist>().Add(s);
                entities.SaveChanges();
                n.Likes = n.LikePlaylist.Count();
                service.Edit(n);
                return new LikeJsonModel { Like = true, Message = "点赞成功" };
            }
            else
            {
                entities.Set<LikePlaylist>().Remove(e);
                entities.SaveChanges();
                n.Likes = n.LikePlaylist.Count();
                service.Edit(n);
                return new LikeJsonModel { Like = false, Message = "取消点赞" };
            }
        }
        public List<PlaylistJsonModel> GetFavoritePlaylists()
        {
            int uid = int.Parse(userId);
            List<PlaylistJsonModel> model = new List<PlaylistJsonModel>();
            var user = entities.User.Find(uid);
            foreach (var item in user.FavoritePlaylist)
            {
                PlaylistJsonModel playlist = new PlaylistJsonModel { Id = item.PlaylistId, Cover = item.Playlist.Cover, Name = item.Playlist.Name };
                model.Add(playlist);
            }
            return model;
        }
        /// <summary>
        /// 获取歌单歌曲
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public List<SongJsonModel> GetSongList(int id)
        {
            var u = service.GetById(id);
            List<SongJsonModel> data = new List<SongJsonModel>();
            foreach (var item in u.PlaylistItem)
            {
                var m = item.Music;
                SongJsonModel model = new SongJsonModel { Id = item.MusicId, ImagePath = m.ImagePath, MusicName = m.MusicName, Path = m.Path, SingerName = item.Music.Singer.Name, Span = m.Span.ToString().Remove(0, 3) };
                data.Add(model);
            }
            return data;
        }
        /// <summary>
        /// 取消收藏歌单
        /// </summary>
        /// <param name="playlists"></param>
        public void CancelCollectPlaylists(List<int> playlists)
        {
            var service = DALFactory.DataAccess.CreateFavoritePlaylistService();
            int uid = int.Parse(userId);
            foreach (var item in playlists)
            {
                service.Remove(service.GetAll().First(u => u.PlaylistId == item && u.UserId == uid).Id);
            }
        }
        public List<CommentJsonModel> GetComments(int id)
        {
            List<CommentJsonModel> Result = new List<CommentJsonModel>();
            Playlist model = service.GetByIdAsNoTracking(id);
            var Comments = model.PlaylistComment.Where(m => m.TargetId == null).OrderByDescending(i => i.Time).ToList();
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
                var n = model.PlaylistComment.Where(m => m.ReplyId == item.Id).OrderByDescending(i=>i.Time).ToList();
                foreach (var it in n) 
                {
                    SubCommentJsonModel sub = new SubCommentJsonModel();
                    var target = it.PlaylistComment3;
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
            var s = DALFactory.DataAccess.CreatePlaylistCommentService();
            PlaylistComment comment = new PlaylistComment();
            comment.Content = value;
            comment.PlaylistId = id;
            comment.UserId = int.Parse(userId);
            comment.Time = DateTime.Now;
            s.Create(comment);
            comment = s.GetByIdAsNoTracking(comment.Id);
            CommentJsonModel model = new CommentJsonModel
            {
                UserId = int.Parse(userId),
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
            var s = DALFactory.DataAccess.CreatePlaylistCommentService();
            var target = s.GetByIdAsNoTracking(targetId);
            PlaylistComment comment = new PlaylistComment();
            comment.Content = value;
            comment.PlaylistId = id;
            comment.UserId = int.Parse(userId);
            comment.Time = DateTime.Now;
            comment.TargetId = targetId;
            if(target.ReplyId!=null)
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
            model.UserId = int.Parse(userId);
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
        public PlaylistJsonModel CreatePlaylist(string name)
        {
            int uid = int.Parse(userId);
            var u = service.GetAllAsNoTracking().FirstOrDefault(n => n.OwnerId == uid && n.Name == name);
            if (u != null)
                return null;
            else
            {
                Playlist model = new Playlist();
                model.Name = name;
                model.OwnerId = uid;
                service.Create(model);
                var o= service.GetByIdAsNoTracking(model.Id);
                PlaylistJsonModel model1 = new PlaylistJsonModel();
                model1.Id = o.Id;
                model1.Description = o.Description;
                model1.Cover = o.Cover;
                model1.CreateTime = o.CreateTime.ToString();
                model1.Likes = 0;
                model1.PlayTimes = 0;
                model1.Tags = new List<string>();
                model1.NickName = o.User.NickName;
                model.IsPublic = o.IsPublic;
                return model1;
                
            }
        }
        public bool DelPlaylist(int id)
        {
           return service.Remove(id)>0;
        }
        public void RmItems(int[] items)
        {
            var sev = DALFactory.DataAccess.CreatePlaylistItemService();
            foreach (var item in items)
            {
                sev.Remove(item);
            }
        }
        public void Modify(int id,string desc,string Tags,bool ispublic,string name, HttpPostedFileBase file)
        {
            
            var model = service.GetById(id);
            model.Description = desc;
            model.IsPublic = ispublic;
            model.Name = name;
            if (file != null)
            {
                string imgPath = "/Sourse/PlaylistCover/" + Guid.NewGuid().ToString() + file.FileName;
                string savepath = HttpContext.Current.Server.MapPath(imgPath);
                file.SaveAs(savepath);
                model.Cover = imgPath;
            }
            service.Edit(model);
            
            if(Tags!=null)
            {
                var sev = DALFactory.DataAccess.CreatePlaylistTypeService();
                var list=sev.GetAll().Where(n => n.PlaylistId == id).ToList();              
                var ids = Tags.Split(',');
                foreach (var it in list)
                {
                    sev.Remove(it.Id);
                }
                foreach (var item in ids)
                {
                    int i = int.Parse(item);
                    PlaylistType k = new PlaylistType();
                    k.SubTypeId = i;
                    k.PlaylistId = id;
                    sev.Create(k);
                }
            }
            

        }
    }
}


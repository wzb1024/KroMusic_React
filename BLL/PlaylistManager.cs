using DAL;
using IDAL;
using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

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

        IPlaylist service = DALFactory.DataAccess.CreatePlaylistService();

        public void saveChanges()
        {
            DBContextFactory.Context.SaveChanges();
        }
        public IQueryable<Playlist> GetAllPlaylists(bool AsNoTracking = true)
        {
            if (AsNoTracking) return service.GetAllAsNoTracking();
            else return service.GetAll();
        }
        public Playlist GetPlaylist(int id, bool AsNoTracking = true)
        {
            if (AsNoTracking) return service.GetByIdAsNoTracking(id);
            else return service.GetById(id);
        }
        public SearchResultJsonModel GetPlaylistsByKeywords(string keywords, int pageIndex, int pageSize)
        {
            var model = new SearchResultJsonModel();
            var query = GetAllPlaylists().Where(u => u.Name.Contains(keywords) || keywords.Contains(u.Name));
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
                var these = GetAllPlaylists().Where(u => u.IsPublic);
                data.Total = these.Count();
                if (orderByHeat)

                    model = these.OrderByDescending(u => u.PlayTimes).Skip((pageIndex - 1) * pageSize).Take(pageSize).ToList();

                else
                    model = these.OrderByDescending(u => u.CreateTime).Skip((pageIndex - 1) * pageSize).Take(pageSize).ToList();
            }
            else
            {
                var these = GetAllPlaylists().Where(u => u.IsPublic && u.PlaylistType.Any(n => n.SubTypeId == id));
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
        public PlaylistJsonModel GetPlaylistJson(int id)
        {
            var self = UserManager.GetSelf();
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
            if (self != null)
            {
                jsonModel.IsCollected = self.FavoritePlaylist.Any(item => item.PlaylistId == id);
                jsonModel.IsLiked = self.LikePlaylist.Any(item => item.PlaylistId == id);
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
            var self = UserManager.GetSelf();
            var exist = self.FavoritePlaylist.FirstOrDefault(u => u.PlaylistId == playlistId);
            if (exist == null)
            {
                FavoritePlaylist s = new FavoritePlaylist();
                s.PlaylistId = playlistId;
                self.FavoritePlaylist.Add(s);
                saveChanges();
                return new CollectJsonModel { Collected = true, Message = "收藏成功" };
            }
            else
            {
                var sev = DALFactory.DataAccess.CreateFavoritePlaylistService();
                sev.Remove(exist.Id);
                return new CollectJsonModel { Collected = false, Message = "取消收藏" };
            }
        }
        public LikeJsonModel Like(int playlistId)
        {
            var self = UserManager.GetSelf();
            var exist = self.LikePlaylist.FirstOrDefault(u => u.PlaylistId == playlistId);
            var p = GetPlaylist(playlistId, false);
            if (exist == null)
            {
                LikePlaylist s = new LikePlaylist();
                s.PlaylistId = playlistId;
                s.Time = DateTime.Now;
                self.LikePlaylist.Add(s);
                saveChanges();
                p.Likes = p.LikePlaylist.Count();
                service.Edit(p);
                return new LikeJsonModel { Like = true, Message = "点赞成功" };
            }
            else
            {
                var sev = DALFactory.DataAccess.CreateLikePlaylistService();
                sev.Remove(exist.Id);
                p.Likes = p.LikePlaylist.Count();
                service.Edit(p);
                return new LikeJsonModel { Like = false, Message = "取消点赞" };
            }
        }
        public List<PlaylistJsonModel> GetFavoritePlaylists()
        {
            var self = UserManager.GetSelf();
            List<PlaylistJsonModel> model = new List<PlaylistJsonModel>();
            foreach (var item in self.FavoritePlaylist)
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
            var u = GetPlaylist(id);
            List<SongJsonModel> data = new List<SongJsonModel>();
            foreach (var item in u.PlaylistItem)
            {
                var m = item.Music;
                SongJsonModel model = new SongJsonModel { Id = item.MusicId, ImagePath = m.ImagePath, SingerId = m.SingerId, MusicName = m.MusicName, Path = m.Path, SingerName = item.Music.Singer.Name, Span = m.Span.ToString().Remove(0, 3) };
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
            var sev = DALFactory.DataAccess.CreateFavoritePlaylistService();
            var self = UserManager.GetSelf();
            foreach (var item in playlists)
            {
                var p = self.FavoritePlaylist.First(u => u.PlaylistId == item);
                sev.Remove(p.Id);
            }
        }
        public List<CommentJsonModel> GetComments(int id)
        {
            List<CommentJsonModel> Result = new List<CommentJsonModel>();
            Playlist model = GetPlaylist(id);
            var Comments = model.PlaylistComment.Where(m => m.TargetId == null).OrderByDescending(i => i.Time);
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
                var n = model.PlaylistComment.Where(m => m.ReplyId == item.Id).OrderByDescending(i => i.Time).ToList();
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
            var self = UserManager.GetSelf();
            PlaylistComment comment = new PlaylistComment();
            comment.Content = value;
            comment.PlaylistId = id;
            comment.Time = DateTime.Now;
            self.PlaylistComment.Add(comment);
            saveChanges();
            CommentJsonModel model = new CommentJsonModel
            {
                UserId = self.Id,
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
            var self = UserManager.GetSelf();
            var p = GetPlaylist(id,false);
            var target = p.PlaylistComment.FirstOrDefault(u => u.Id == targetId);
            PlaylistComment comment = new PlaylistComment();
            comment.Content = value;

            comment.UserId = self.Id;
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
            p.PlaylistComment.Add(comment);
            saveChanges();
            SubCommentJsonModel model = new SubCommentJsonModel();
            model.UserId = self.Id;
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
            var self = UserManager.GetSelf();
            var u = self.Playlist.FirstOrDefault(n => n.Name == name);
            if (u != null)
                return null;
            else
            {
                Playlist model = new Playlist();
                model.Name = name;
                model.Cover = Config.PlaylistCoverDir + "Default.png";
                model.CreateTime = DateTime.Now;
                model.Description = "主人没有留下任何描述哦~";
                model.Likes = 0;
                model.IsPublic = false;
                model.PlayTimes = 0;
                self.Playlist.Add(model);
                saveChanges();
                var o = GetPlaylistJson(model.Id);
                return o;

            }
        }
        public bool DelPlaylist(int id)
        {
            return service.Remove(id) > 0;
        }
        public void RmItems(int[] items)
        {
            var sev = DALFactory.DataAccess.CreatePlaylistItemService();
            foreach (var item in items)
            {
                sev.Remove(item);
            }
        }
        public void Modify(int id, string desc, string Tags, bool ispublic, string name, HttpPostedFileBase file)
        {

            var model = GetPlaylist(id, false);
            model.Description = desc;
            model.IsPublic = ispublic;
            model.Name = name;
            if (file != null)
            {
                string imgPath = Config.PlaylistCoverDir + Guid.NewGuid().ToString() + file.FileName;
                string savepath = HttpContext.Current.Server.MapPath(imgPath);
                file.SaveAs(savepath);
                model.Cover = imgPath;
            }
            service.Edit(model);

            if (Tags != null)
            {
                var ids = Tags.Split(',');
                model.PlaylistType.Clear();
                saveChanges();
                foreach (var item in ids)
                {
                    int i = int.Parse(item);
                    PlaylistType k = new PlaylistType();
                    k.SubTypeId = i;
                    model.PlaylistType.Add(k);
                    saveChanges();

                }
            }
        }
        public List<RecoJsonModel> GetReco()
        {
            List<RecoJsonModel> reco = new List<RecoJsonModel>();
            var All = GetAllPlaylists().OrderByDescending(k => k.PlayTimes).Take(9);
            RecoJsonModel x = new RecoJsonModel();
            x.Title = "全部歌单";
            foreach (var item in All)
            {
                PlaylistCardJsonModel model = new PlaylistCardJsonModel();
                model.Id = item.Id;
                model.Name = item.Name;
                model.PlayTimes = item.PlayTimes;
                model.Cover = item.Cover;
                x.List.Add(model);
            }
            reco.Add(x);
            var entity = DBContextFactory.Context;
            Random r = new Random();
            for (int j = 0; j < 3; j++)
            {
                RecoJsonModel re = new RecoJsonModel();
                int i = r.Next(1, 30);
                var con = entity.SubType.Find(i);
                while (con == null)
                {
                    i = r.Next(1, 30);
                    con = entity.SubType.Find(i);
                }
                re.Title = con.Name;
                var list = con.PlaylistType.OrderByDescending(v => v.Playlist.PlayTimes).Take(9);
                foreach (var item in list)
                {
                    PlaylistCardJsonModel model = new PlaylistCardJsonModel();
                    model.Id = item.PlaylistId;
                    model.Name = item.Playlist.Name;
                    model.PlayTimes = item.Playlist.PlayTimes;
                    model.Cover = item.Playlist.Cover;
                    re.List.Add(model);
                }
                reco.Add(re);
            }
            return reco;
        }
    }
}


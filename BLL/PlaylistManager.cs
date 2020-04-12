using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DAL;
using Model;

namespace BLL
{
    public class SelfPlaylistJsonModel
    {
        public int Id { get; set; }
        public string Cover { get; set; }
        public string Name { get; set; }
        public bool IsPublic { get; set; }
    }
    /// <summary>
    /// 歌单卡片展示页面数据
    /// </summary>
    public class PlaylistCardJsonModel
    {
        public int Id { get; set; }
        public int OwnerId { get; set; }
        public string NikName { set; get; }
        public int PlayTimes { get; set; }
        public string Cover { get; set; }
        public string Name { get; set; }
    }
    public class PlaylistCardsJsonModel
    {
        public int Total { get; set; }
        public List<PlaylistCardJsonModel> Playlists { get; set; }
    }
    /// <summary>
    /// 序列化歌单数据
    /// </summary>
    public class PlaylistJsonModel
    {
        public int Id { get; set; }
        public int Likes { get; set; }
        public int OwnerId { get; set; }
        public string Description { get; set; }
        public string CreateTime { get; set; }
        public int PlayTimes { get; set; }
        public string Cover { get; set; }
        public string Name { get; set; }
        public string NickName { get; set; }
        public List<string> Tags { get; set; }
        public bool IsLiked { get; set; } = false;
        public bool IsCollected { get; set; } = false;
    }
    /// <summary>
    /// 收藏行为数据模型
    /// </summary>
    public class CollectJsonModel
    {
        public bool State = true;
        public string Message { get; set; }
        public bool Collected { get; set; }
    }
    /// <summary>
    /// 点赞行为数据模型
    /// </summary>
    public class LikeJsonModel
    {
        public bool State = true;
        public string Message { get; set; }
        public bool Like { get; set; }
    }
    public class PlaylistManager : BaseManager<Playlist>
    {
        KroMusicEntities entities = new KroMusicEntities();
        string userId = HttpContext.Current.Session["UserId"]==null?null: HttpContext.Current.Session["UserId"].ToString();
        public override BaseService<Playlist> GetDAL()
        {
            return new PlaylistService(entities);
        }
        public List<Playlist> GetPlaylistsByKeywords(string keywords)
        {
            return GetAllAsNoTracking().Where(u => u.Name.Contains(keywords)).OrderByDescending(i=>i.PlayTimes).ToList();
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
                var these = GetAllAsNoTracking().Where(u => u.IsPublic);
                data.Total = these.Count();
                if (orderByHeat)

                    model = these.OrderByDescending(u => u.PlayTimes).Skip((pageIndex - 1) * pageSize).Take(pageSize).ToList();

                else
                    model = these.OrderByDescending(u => u.CreateTime).Skip((pageIndex - 1) * pageSize).Take(pageSize).ToList();
            }
            else
            {
                var these = GetAllAsNoTracking().Where(u => u.IsPublic && u.PlaylistType.Any(n => n.SubTypeId == id));
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
            var model = GetById(id);
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
            if(userId!=null)
            {
                int uid = int.Parse(userId);
               jsonModel.IsCollected= model.FavoritePlaylist.Any(item => item.UserId == uid);
                jsonModel.IsLiked=model.LikePlaylist.Any(item => item.UserId == uid);
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
                return new CollectJsonModel { Collected=true,Message="收藏成功" };
            }
            else
            {
                entities.Set<FavoritePlaylist>().Remove(e);
                entities.SaveChanges();
                return  new CollectJsonModel { Collected = false, Message = "取消收藏" };
            }
        }
        public LikeJsonModel Like(int playlistId)
        {
            int uid = int.Parse(userId);
            var e = entities.Set<LikePlaylist>().FirstOrDefault(u => u.PlaylistId == playlistId && u.UserId == uid);
            var n = GetById(playlistId);
            if (e == null)
            {
                LikePlaylist s = new LikePlaylist();
                s.UserId = uid;
                s.PlaylistId = playlistId;
                s.Time = DateTime.Now;
                entities.Set<LikePlaylist>().Add(s);
                entities.SaveChanges();
                n.Likes = n.LikePlaylist.Count();
                Edit(n);
                return new LikeJsonModel { Like = true, Message = "点赞成功" };
            }
            else
            {
                entities.Set<LikePlaylist>().Remove(e);
                entities.SaveChanges();
                n.Likes = n.LikePlaylist.Count();
                Edit(n);
                return new LikeJsonModel { Like = false, Message = "取消点赞" };
            }
        }
        public List<SelfPlaylistJsonModel> GetSelfPlaylists(int id)
        {
            List<SelfPlaylistJsonModel> model = new List<SelfPlaylistJsonModel>();
            var user = GetById(id);
            foreach (var item in entities.Playlist.Where(u => u.OwnerId == id))
            {
                SelfPlaylistJsonModel playlist = new SelfPlaylistJsonModel { Id = item.Id, Cover = item.Cover, Name = item.Name, IsPublic = item.IsPublic };
                model.Add(playlist);
            }
            return model;
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
        public List<MusicJsonModel> GetSongList(int id)
        {
            var u = GetById(id);
            List<MusicJsonModel> data = new List<MusicJsonModel>();
            foreach (var item in u.PlaylistItem)
            {
                var m=item.Music;
                MusicJsonModel model = new MusicJsonModel { Id = item.Id, ImagePath = m.ImagePath, MusicName = m.MusicName, Path = m.Path, SingerName = item.Music.Singer.Name, Span = m.Span.ToString().Remove(0,3)};
                data.Add(model);
            }
            return data;
        }
    }
    public class FavoritePlaylistManager : BaseManager<FavoritePlaylist>
    {
        KroMusicEntities entities = new KroMusicEntities();
        string userId = HttpContext.Current.Session["UserId"] == null ? null : HttpContext.Current.Session["UserId"].ToString();
        public override BaseService<FavoritePlaylist> GetDAL()
        {
            return new FavoritePlaylistService(entities);
        }
        public void CancelCollectPlaylists(List<int> playlists)
        {
            int uid = int.Parse(userId);
            foreach (var item in playlists)
            {
                Remove(GetAll().First(u => u.PlaylistId == item && u.UserId ==uid).Id);
            }
        }

    }
    public class PlaylistTypeManager : BaseManager<PlaylistType>
    {
        KroMusicEntities entities = new KroMusicEntities();

        public override BaseService<PlaylistType> GetDAL()
        {
            return new PlaylistTypeService(entities);
        }

    }
}


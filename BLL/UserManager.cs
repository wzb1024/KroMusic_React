using DAL;
using Model;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using System.Web;
using IDAL;
using DALFactory;
using System;
using System.Web.ModelBinding;
using System.Security;

namespace BLL
{
   
    public class UserManager
    {
        //private UserManager() { }                                       //单例模式
        //private static UserManager instance = new UserManager();
        //public static UserManager Instance { get { return instance; } }

        IUser service = DataAccess.CreateUserService();
        public void saveChanges()
        {
            DBContextFactory.Context.SaveChanges();
        }
        public IQueryable<User> GetAllUsers(bool AsNoTracking = true)
        {
            if (AsNoTracking) return service.GetAllAsNoTracking();
            else return service.GetAll();
        }
        public static User GetUser(int id)
        {
            return DBContextFactory.Context.User.Find(id);
        }
        public static User GetSelf()
        {
            string userId = HttpContext.Current.Session["UserId"] == null ? null : HttpContext.Current.Session["UserId"].ToString();
            if (userId == null)
                return null;
            else
            {
                int uid = int.Parse(userId);
                return GetUser(uid);
            }
           
        }
        public bool Success(string userName, string password)
        {
            return GetAllUsers().Any(m => m.UserName == userName && m.Password == password);
        }
        public int GetId(string userName)
        {
            return GetAllUsers().First(m => m.UserName == userName).Id;
        }
        public bool CheckName(string userName)
        {
            return GetAllUsers().FirstOrDefault(m => m.UserName == userName)!=null;
        }
        //注册时检测昵称
        public bool ExistNickName(string nickName)
        {
            return GetAllUsers().FirstOrDefault(m => m.NickName == nickName) != null;
        }
        //修改昵称时检测
        public bool ExistNickName(string nickName, int id)
        {
            return GetAllUsers().FirstOrDefault(m => m.NickName == nickName && m.Id != id) != null;
        }
        public bool Create(string userName, string password, string nikName, string gender, int age, string email, string path)
        {
            User user = new User();
            user.UserName = userName;
            user.Password = password;
            user.NickName = nikName;
            user.Hdimage = path;
            user.Gender = gender;
            user.Age = age;
            user.Email = email;
            return service.Create(user)>0;
        }
        public AccountInfoJsonModel GetAccountMsg(int id)
        {
            AccountInfoJsonModel model;
            var user = GetUser(id);
            model = ConvertHelper.UserConvert(user);  
            return model;
        }
        public List<PlaylistJsonModel> GetSelfPlaylists()
        {
            var self = GetSelf();
            List<PlaylistJsonModel> model = new List<PlaylistJsonModel>();
            var all = self.Playlist.ToList();
            foreach (var item in all)
            {
                PlaylistJsonModel playlist = new PlaylistJsonModel();
                playlist.Id = item.Id;
                playlist.Name = item.Name;
                playlist.Description = item.Description;
                playlist.Cover = item.Cover;
                playlist.CreateTime = item.CreateTime.ToString();
                playlist.Likes = 0;
                playlist.PlayTimes = 0;       
                playlist.NickName = item.User.NickName;
                playlist.IsPublic = item.IsPublic;
                var tag = item.PlaylistType.ToList();
                List<String> subs = new List<string>();
                List<int> ids = new List<int>();
                foreach (var it in tag)
                {
                    subs.Add(it.SubType.Name);
                    ids.Add(it.SubTypeId);
                }
                playlist.Tags = subs;
                playlist.TagId = ids;
                var songs = item.PlaylistItem.ToList();
                var items = new List<SongJsonModel>();
                foreach ( var i in songs)
                {
                    SongJsonModel m = new SongJsonModel();
                    m.Id = i.Id;
                    m.SingerName = i.Music.Singer.Name;
                    m.MusicName = i.Music.MusicName;
                    items.Add(m);
                }
                playlist.Songs = items;
                model.Add(playlist);
            }

            return model;
        }
        public void ChangeHdimage(string path)
        {
            var self = GetSelf();
            File.Delete(HttpContext.Current.Server.MapPath(self.Hdimage));
            self.Hdimage = path;
            service.Edit(self);
        }
        public bool ModifyMsg(ModifyMsgJsonModel model,int id)
        {
            var user = service.GetById(id);
            user.Age = model.Age;
            user.Email = model.Email;
            user.NickName = model.NickName;
            return service.Edit(user)>0;
        }
        public List<SongJsonModel> GetFavoSongs()
        {
            var self = GetSelf();
            List<SongJsonModel> list = new List<SongJsonModel>();
            var songs = self.FavoriteMusic.ToList();
            foreach (var item in songs)
            {
                SongJsonModel song = new SongJsonModel();
                song.Id = item.MusicId;
                song.MusicName = item.Music.MusicName;
                song.SingerName = item.Music.Singer.Name;
                song.SingerId = item.Music.SingerId;
                song.Span = item.Music.Span.ToString().Remove(0, 3);
                list.Add(song);
            }
            return list;
        }
        public bool RmFavoSong(int mid)
        {
            var self = GetSelf();
            var exist = self.FavoriteMusic.FirstOrDefault(it => it.MusicId == mid);
            if(exist != null)
            {
                var sev = DataAccess.CreateFavoriteMusicService();
               return sev.Remove(exist.Id)>0;
            }
            return false;

        }
        public bool Focus(int id)
        {
            var self = GetSelf();
            var exist = self.SingerAttention.FirstOrDefault(it => it.SingerId == id);
            if(exist!=null)
            {
                var sev = DataAccess.CreateSingerAttentionService();
                sev.Remove(exist.Id);
                
                return false;
            }
            else
            {
                
                SingerAttention SingerAttention = new SingerAttention();
                SingerAttention.SingerId = id;
                self.SingerAttention.Add(SingerAttention);
                saveChanges();
                return true;
            }
        }
        public List<SingerAttentionJsonModel> GetSingerAttention()
        {
            var self = GetSelf();
            List<SingerAttentionJsonModel> list = new List<SingerAttentionJsonModel>();
            var s = self.SingerAttention.ToList();
            foreach (var item in s)
            {
                SingerAttentionJsonModel t = new SingerAttentionJsonModel();
                t.Id = item.SingerId;
                t.ImgPath = item.Singer.Image;
                t.Name = item.Singer.Name;
                list.Add(t);
            }
            return list;
        }
        public void Visit(int id)
        {
            var sev = DataAccess.CreatePlaylistCommentService();
            var c = sev.GetById(id);
            c.Visited = true;
            sev.Edit(c);
        }
    }
}
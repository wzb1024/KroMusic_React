﻿using DAL;
using Model;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using System.Web;
using IDAL;
using DALFactory;
using System;

namespace BLL
{
    public class ModifyMsgJsonModel
    {
        [StringLength(6, MinimumLength = 3, ErrorMessage = "昵称长度为3~6")]
        public string NickName { get; set; }
        [EmailAddress]
        public string Email { get; set; }
        [Range(6, 99, ErrorMessage = "非法年龄！")]
        public int Age { get; set; }

    }

    public class AccountInfoJsonModel
    {
        public string Hdimage { get; set; }
        public string NickName { get; set; }
        public string Gender { get; set; }
        public int Age { get; set; }
        public string Email { get; set; }
    }
    public partial class UserManager
    {
        //private UserManager() { }                                       //单例模式
        //private static UserManager instance = new UserManager();
        //public static UserManager Instance { get { return instance; } }

        IUserService service = DataAccess.CreateUserService();
        KroMusicEntities entities = DBContextFactory.GetContext();
        string userId = HttpContext.Current.Session["UserId"] == null ? null : HttpContext.Current.Session["UserId"].ToString();
        User self = null;
        public UserManager()
        {
            if (userId != null)
                self = service.GetById(int.Parse(userId));
        }
        public User GetUserById(int id)
        {
            return service.GetById(id);
        }
        public bool Success(string userName, string password)
        {
            return service.GetAll().Any(m => m.UserName == userName && m.Password == password);
        }
        public int GetId(string userName)
        {
            return service.GetAll().First(m => m.UserName == userName).Id;
        }
        public bool CheckName(string userName)
        {
            return service.GetAllAsNoTracking().FirstOrDefault(m => m.UserName == userName)!=null;
        }
        public bool ExistNickName(string nickName)
        {
            return service.GetAllAsNoTracking().FirstOrDefault(m => m.NickName == nickName) != null;
        }
        public bool ExistNickName(string nickName, int id)
        {
            return service.GetAll().FirstOrDefault(m => m.NickName == nickName && m.Id != id) != null;
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
            var user = service.GetById(id);
            model = new AccountInfoJsonModel { NickName = user.NickName, Age = user.Age, Email = user.Email, Gender = user.Gender, Hdimage = user.Hdimage };        
            return model;
        }
        public List<SongJsonModel> GetFavoriteMusics(int id)
        {
            List<SongJsonModel> model = new List<SongJsonModel>();
            var user = service.GetById(id);
            foreach (var item in user.FavoriteMusic)
            {
                SongJsonModel music = new SongJsonModel { Id = item.MusicId, ImagePath = item.Music.ImagePath, MusicName = item.Music.MusicName, Path = item.Music.Path, SingerName = item.Music.Singer.Name, Span = item.Music.Span.ToString().Remove(0, 3) };
                model.Add(music);
            }
            return model;
        }
       
        public List<SingerJsonModel> GetAttendSingers(int id)
        {
            List<SingerJsonModel> model = new List<SingerJsonModel>();
            var user = service.GetById(id);
            foreach (var item in user.Attention)
            {
                SingerJsonModel singer = new SingerJsonModel { Id = item.SingerId, Image = item.Singer.Image, Name = item.Singer.Name };
                model.Add(singer);
            }
            return model;
        }
        public List<PlaylistJsonModel> GetSelfPlaylists()
        {
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
            var it = entities.FavoriteMusic.FirstOrDefault(i => i.UserId == self.Id && i.MusicId == mid);
            if(it!=null)
            entities.FavoriteMusic.Remove(it);
            return entities.SaveChanges() > 0;

        }
        public bool Focus(int id)
        {
            var exist = entities.Attention.FirstOrDefault(it => it.UserId == self.Id && it.SingerId == id) ;
            if(exist!=null)
            {
                entities.Attention.Remove(exist);
                entities.SaveChanges();
                return false;
            }
            else
            {
                Attention attention = new Attention();
                attention.UserId = self.Id;
                attention.SingerId = id;
                entities.Attention.Add(attention);
                entities.SaveChanges();
                return true;
            }
        }

    }
}
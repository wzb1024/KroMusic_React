using Model;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL
{
    public class ConvertHelper
    {
        public static AccountInfoJsonModel UserConvert(User user)
        {
            return new AccountInfoJsonModel { NickName = user.NickName, Age = user.Age, Email = user.Email, Gender = user.Gender, Hdimage = user.Hdimage };
        }
        public static SingerJsonModel SingerConvert(Singer singer)
        {
            SingerJsonModel model = new SingerJsonModel();
            model.Id = singer.Id;
            model.Image = singer.Image;
            model.Name = singer.Name;
            model.Nationality = singer.Nationality;
            model.Gender = singer.Gender;
            model.Age = singer.Age;
            model.Fans = singer.SingerAttention.Count();
            model.Amount = singer.Music.Count();
            return model;
        }
        public static SongJsonModel SongConvert(Music s)
        {
            var self = UserManager.GetSelf();
            SongJsonModel t = new SongJsonModel();
            t.Genre = s.Genre;
            t.PlayTimes = s.PlayTimes;
            t.SingerId = s.SingerId;
            t.SingerName = s.Singer.Name;
            t.Id = s.Id;
            t.ImagePath = s.ImagePath;
            t.MusicName = s.MusicName;
            t.ReleaseTime = s.ReleaseTime.ToShortDateString();
            t.Path = s.Path;
            if (self != null)
            {

                t.Favorite = s.FavoriteMusic.Any(it => it.UserId == self.Id);
                t.Like = s.LikeMusic.Any(it => it.UserId == self.Id);
            }
            return t;
        }

    }
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
    public class SubTypeJsonModel
    {
        public string TypeName { get; set; }
        public List<CategoryJsonModel> Categories = new List<CategoryJsonModel>();
    }
    public class CategoryJsonModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
    public class SongJsonModel
    {
        public int Id { get; set; }
        public int PlayTimes { get; set; }
        public string MusicName { get; set; }
        public int SingerId { get; set; }
        public string SingerName { get; set; }
        public string Path { get; set; }
        public string ImagePath { get; set; }
        public string Span { get; set; }
        public bool Like { get; set; } = false;
        public bool Favorite { get; set; } = false;
        public string ReleaseTime { get; set; }
        public string Size { get; set; }
        public string Genre { get; set; }
    }
    public class SingerJsonModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Gender { get; set; }
        public string Image { get; set; }
        public int Age { get; set; }
        public int Fans { get; set; }
        public string Nationality { get; set; }
        public int Amount { get; set; }
        public bool Focused { get; set; } = false;
    }
    public class CommentJsonModel
    {
        public int Id { get; set; }
        public string Hdimg { get; set; }
       public int UserId { get; set; }
        public string Content { get; set; }
        public string Time { get; set; }
        public string NickName { get; set; }
        public List<SubCommentJsonModel> SubComments { get; set; }
    }
    public class SubCommentJsonModel
    {
        public int Id { get; set; }
        public string Hdimg { get; set; }
        public int UserId { get; set; }
        public int TargetId { get; set; }
        public int TarUserId { get; set; }
        public string TarName { get; set; }
        public string TarHdimg { get; set; }
        public string Content { get; set; }
        public string Time { get; set; }
        public string NickName { get; set; }
    }
    public class SearchResultItemJsonModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Owner { get; set; }
    }
    public class SearchResultJsonModel
    {
        public List<SearchResultItemJsonModel> List { get; set; }
        public int Total { get; set; }
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
        public bool IsPublic { get; set; } = true;
        public List<SongJsonModel> Songs { get; set; }
        public List<int> TagId { get; set; }
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

    public class SingerAttentionJsonModel
    {
        public int Id { get; set; }
        public string ImgPath { get; set; }
        public string Name { get; set; }
    }
    public class RecoJsonModel {
        public string Title { get; set; }
        public List<PlaylistCardJsonModel> List = new List<PlaylistCardJsonModel>();
    }
    public class MessageJsonModel
    {
        public int Id { get; set; }
        public int Pid { get; set; }
        public string PName { get; set; }
        public string Img { get; set; }
        public string NickName { get; set; }
        public string Content { get; set; }
        public string Time { get; set; }
    }
}

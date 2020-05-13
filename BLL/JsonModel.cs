using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL
{
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
        public string Lyric { get; set; }
        public string Region { get; set; }
        public string ReleaseTime { get; set; }
        public string Size { get; set; }
        public List<string> Tags { get; set; }
    }
    public class SingerJsonModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
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
}

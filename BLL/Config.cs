using System.Configuration;

namespace BLL
{
    public static class Config
    {
        public static string MusicDir { get {return ConfigurationManager.AppSettings["MusicDir"].ToString(); } }
        public static string MusicCoverDir { get { return ConfigurationManager.AppSettings["MusicCoverDir"].ToString(); } }
        public static string PlaylistCoverDir { get { return ConfigurationManager.AppSettings["PlaylistCoverDir"].ToString(); } }
        public static string SingerCoverDir { get { return ConfigurationManager.AppSettings["SingerCoverDir"].ToString(); } }
        public static string HeadImageDir { get { return ConfigurationManager.AppSettings["HeadImageDir"].ToString(); } }
    }
}

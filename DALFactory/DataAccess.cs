using IDAL;
using System.Configuration;
using System.Reflection;

namespace DALFactory
{
    public class DataAccess
    {
        private static string AssemblyName = ConfigurationManager.AppSettings["Path"].ToString();
        private static string db = ConfigurationManager.AppSettings["DB"].ToString();
        public static IUser CreateUserService()
        {
            string className = AssemblyName + "." + db + "UserService";
            return (IUser)Assembly.Load(AssemblyName).CreateInstance(className);
        }
        public static ISinger CreateSingerrService()
        {
            string className = AssemblyName + "." + db + "SingerService";
            return (ISinger)Assembly.Load(AssemblyName).CreateInstance(className);
        }
        public static IMusic CreateMusicService()
        {
            string className = AssemblyName + "." + db + "MusicService";
            return (IMusic)Assembly.Load(AssemblyName).CreateInstance(className);
        }
        public static ILikeMusic CreateLikeMusicService()
        {
            string className = AssemblyName + "." + db + "LikeMusicService";
            return (ILikeMusic)Assembly.Load(AssemblyName).CreateInstance(className);
        }
        public static IFavoriteMusic CreateFavoriteMusicService()
        {
            string className = AssemblyName + "." + db + "FavoriteMusicService";
            return (IFavoriteMusic)Assembly.Load(AssemblyName).CreateInstance(className);
        }
        public static IPlaylist CreatePlaylistService()
        {
            string className = AssemblyName + "." + db + "PlaylistService";
            return (IPlaylist)Assembly.Load(AssemblyName).CreateInstance(className);
        }
        public static IType CreateTypeService()
        {
            string className = AssemblyName + "." + db + "TypeService";
            return (IType)Assembly.Load(AssemblyName).CreateInstance(className);
        }
        public static IFavoritePlaylist CreateFavoritePlaylistService()
        {
            string className = AssemblyName + "." + db + "FavoritePlaylistService";
            return (IFavoritePlaylist)Assembly.Load(AssemblyName).CreateInstance(className);
        }
        public static ILikePlaylist CreateLikePlaylistService()
        {
            string className = AssemblyName + "." + db + "LikePlaylistService";
            return (ILikePlaylist)Assembly.Load(AssemblyName).CreateInstance(className);
        }
        public static IPlaylistComment CreatePlaylistCommentService()
        {
            string className = AssemblyName + "." + db + "PlaylistCommentService";
            return (IPlaylistComment)Assembly.Load(AssemblyName).CreateInstance(className);
        }
        public static IMusicComment CreateMusicCommentService()
        {
            string className = AssemblyName + "." + db + "MusicCommentService";
            return (IMusicComment)Assembly.Load(AssemblyName).CreateInstance(className);
        }
        public static IPlaylistItem CreatePlaylistItemService()
        {
            string className = AssemblyName + "." + db + "PlaylistItemService";
            return (IPlaylistItem)Assembly.Load(AssemblyName).CreateInstance(className);
        }
        public static ISingerAttention CreateSingerAttentionService()
        {
            string className = AssemblyName + "." + db + "SingerAttentionService";
            return (ISingerAttention)Assembly.Load(AssemblyName).CreateInstance(className);
        }
    }
}

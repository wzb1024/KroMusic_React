using IDAL;
using System.Configuration;
using System.Reflection;

namespace DALFactory
{
    public class DataAccess
    {
        private static string AssemblyName = ConfigurationManager.AppSettings["Path"].ToString();
        private static string db = ConfigurationManager.AppSettings["DB"].ToString();
        public static IUserService CreateUserService()
        {
            string className = AssemblyName + "." + db + "UserService";
            return (IUserService)Assembly.Load(AssemblyName).CreateInstance(className);
        }
        public static ISingerService CreateSingerrService()
        {
            string className = AssemblyName + "." + db + "SingerService";
            return (ISingerService)Assembly.Load(AssemblyName).CreateInstance(className);
        }
        public static IMusicService CreateMusicService()
        {
            string className = AssemblyName + "." + db + "MusicService";
            return (IMusicService)Assembly.Load(AssemblyName).CreateInstance(className);
        }
        public static IPlaylistService CreatePlaylistService()
        {
            string className = AssemblyName + "." + db + "PlaylistService";
            return (IPlaylistService)Assembly.Load(AssemblyName).CreateInstance(className);
        }
        public static ITypeService CreateTypeService()
        {
            string className = AssemblyName + "." + db + "TypeService";
            return (ITypeService)Assembly.Load(AssemblyName).CreateInstance(className);
        }
        public static IFavoritePlaylistService CreateFavoritePlaylistService()
        {
            string className = AssemblyName + "." + db + "FavoritePlaylist";
            return (IFavoritePlaylistService)Assembly.Load(AssemblyName).CreateInstance(className);
        }
        public static IPlaylistCommentService CreatePlaylistCommentService()
        {
            string className = AssemblyName + "." + db + "PlaylistCommentService";
            return (IPlaylistCommentService)Assembly.Load(AssemblyName).CreateInstance(className);
        }
        public static IMusicCommentService CreateMusicCommentService()
        {
            string className = AssemblyName + "." + db + "MusicCommentService";
            return (IMusicCommentService)Assembly.Load(AssemblyName).CreateInstance(className);
        }
        public static IPlaylistItemService CreatePlaylistItemService()
        {
            string className = AssemblyName + "." + db + "PlaylistItemService";
            return (IPlaylistItemService)Assembly.Load(AssemblyName).CreateInstance(className);
        }
        public static IPlaylistTypeService CreatePlaylistTypeService()
        {
            string className = AssemblyName + "." + db + "PlaylistTypeService";
            return (IPlaylistTypeService)Assembly.Load(AssemblyName).CreateInstance(className);
        }
    }
}

using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using IDAL;

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
    }
}

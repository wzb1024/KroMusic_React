using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using IDAL;
using Model;

namespace DAL
{
    public class SqlPlaylistService:BaseService<Playlist>,IPlaylist
    {

        public override Expression<Func<Playlist, bool>> GetByIdKey(int id)
        {
            return u => u.Id == id;
        }
    }
    public class SqlFavoritePlaylistService : BaseService<FavoritePlaylist>,IFavoritePlaylist
    {

        public override Expression<Func<FavoritePlaylist, bool>> GetByIdKey(int id)
        {
            return u => u.Id == id;
        }
    }
    public class SqlLikePlaylistService : BaseService<LikePlaylist>, ILikePlaylist
    {

        public override Expression<Func<LikePlaylist, bool>> GetByIdKey(int id)
        {
            return u => u.Id == id;
        }
    }
    public class SqlPlaylistTypeService : BaseService<PlaylistType>, IPlaylistTypeService
    {

        public override Expression<Func<PlaylistType, bool>> GetByIdKey(int id)
        {
            return u => u.Id == id;
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using Model;

namespace DAL
{
    public class PlaylistService:SqlBaseService<Playlist>
    {
        public PlaylistService(KroMusicEntities entities):base(entities)
        {

        }

        public override Expression<Func<Playlist, bool>> GetByIdKey(int id)
        {
            return u => u.Id == id;
        }
    }
    public class FavoritePlaylistService : SqlBaseService<FavoritePlaylist>
    {
        public FavoritePlaylistService(KroMusicEntities entities) : base(entities)
        {

        }

        public override Expression<Func<FavoritePlaylist, bool>> GetByIdKey(int id)
        {
            return u => u.Id == id;
        }
    }
    public class PlaylistTypeService : SqlBaseService<PlaylistType>
    {
        public PlaylistTypeService(KroMusicEntities entities) : base(entities)
        {

        }

        public override Expression<Func<PlaylistType, bool>> GetByIdKey(int id)
        {
            return u => u.Id == id;
        }
    }
}

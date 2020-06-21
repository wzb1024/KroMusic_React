using IDAL;
using Model;
using System;
using System.Linq.Expressions;

namespace DAL
{
    public class SqlPlaylistItemService : BaseService<PlaylistItem>, IPlaylistItem
    {
        public override Expression<Func<PlaylistItem, bool>> GetByIdKey(int id)
        {
            return u => u.Id == id;
        }
    }
}

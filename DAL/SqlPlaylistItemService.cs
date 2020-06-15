using System;
using IDAL;
using Model;
using System.Linq.Expressions;

namespace DAL
{
    public class SqlPlaylistItemService : BaseService<PlaylistItem>, IPlaylistItemService
    {
        public override Expression<Func<PlaylistItem, bool>> GetByIdKey(int id)
        {
            return u => u.Id == id;
        }
    }
}

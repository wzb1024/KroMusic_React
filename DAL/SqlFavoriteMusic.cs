using IDAL;
using Model;
using System;
using System.Linq.Expressions;

namespace DAL
{
    public class SqlFavoriteMusicService : BaseService<FavoriteMusic>, IFavoriteMusic
    {

        public override Expression<Func<FavoriteMusic, bool>> GetByIdKey(int id)
        {
            return u => u.Id == id;
        }
    }
}

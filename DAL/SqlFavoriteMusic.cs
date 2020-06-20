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
    public class SqlFavoriteMusicService : BaseService<FavoriteMusic>, IFavoriteMusic
    {

        public override Expression<Func<FavoriteMusic, bool>> GetByIdKey(int id)
        {
            return u => u.Id == id;
        }
    }
}

using IDAL;
using Model;
using System;
using System.Linq.Expressions;

namespace DAL
{
    public class SqlLikeMusicService : BaseService<LikeMusic>, ILikeMusic
    {
        public override Expression<Func<LikeMusic, bool>> GetByIdKey(int id)
        {
            return u => u.Id == id;
        }
    }
}

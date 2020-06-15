using IDAL;
using Model;
using System;
using System.Linq.Expressions;

namespace DAL
{
    public class SqlMusicService : BaseService<Music>,IMusicService
    {
        public override Expression<Func<Music, bool>> GetByIdKey(int id)
        {
            return u => u.Id == id;
        }
    }
}

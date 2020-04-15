using Model;
using System;
using System.Linq.Expressions;

namespace DAL
{
    public class SqlUserService : SqlBaseService<User>
    {
        public SqlUserService(KroMusicEntities entities):base(entities)
        {

        }

        public override Expression<Func<User, bool>> GetByIdKey(int id)
        {
            return u => u.Id == id;
        }
    }
}

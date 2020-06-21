using IDAL;
using Model;
using System;
using System.Linq.Expressions;

namespace DAL
{
    public class SqlUserService : BaseService<User>, IUser
    {
        public override Expression<Func<User, bool>> GetByIdKey(int id)
        {
            return u => u.Id == id;
        }
    }
}

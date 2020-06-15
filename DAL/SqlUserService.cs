using IDAL;
using Model;
using System;
using System.Linq.Expressions;

namespace DAL
{
    public class SqlUserService : BaseService<User>,IUserService
    {
        public override Expression<Func<User, bool>> GetByIdKey(int id)
        {
            return u => u.Id == id;
        }
    }
}

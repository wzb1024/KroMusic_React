using IDAL;
using Model;
using System;
using System.Linq.Expressions;

namespace DAL
{
    public class SqlSingerService : BaseService<Singer>, ISinger
    {
        public override Expression<Func<Singer, bool>> GetByIdKey(int id)
        {
            return u => u.Id == id;
        }
    }
}

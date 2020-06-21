using IDAL;
using System;
using System.Linq.Expressions;

namespace DAL
{
    public class SqlTypeService : BaseService<Model.Type>, IType
    {
        public override Expression<Func<Model.Type, bool>> GetByIdKey(int id)
        {
            return u => u.Id == id;
        }
    }
}

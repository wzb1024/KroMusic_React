using IDAL;
using Model;
using System;
using System.Linq.Expressions;

namespace DAL
{
    public class SqlTypeService : BaseService<Model.Type>,ITypeService
    {
        public override Expression<Func<Model.Type, bool>> GetByIdKey(int id)
        {
            return u => u.Id == id;
        }
    }
}

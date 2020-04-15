using Model;
using System;
using System.Linq.Expressions;

namespace DAL
{
    public class CategoryService : SqlBaseService<Model.Type>
    {
        public CategoryService(KroMusicEntities entities) : base(entities)
        {

        }
        public override Expression<Func<Model.Type, bool>> GetByIdKey(int id)
        {
            return u => u.Id == id;
        }
    }
    public class SubTypeService : SqlBaseService<Model.SubType>
    {
        public SubTypeService(KroMusicEntities entities) : base(entities)
        {

        }
        public override Expression<Func<Model.SubType, bool>> GetByIdKey(int id)
        {
            return u => u.Id == id;
        }
    }
}

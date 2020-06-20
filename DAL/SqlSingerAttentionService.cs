using IDAL;
using Model;
using System;
using System.Linq.Expressions;

namespace DAL
{
    public class SqlSingerAttentionService : BaseService<SingerAttention>, ISingerAttention
    {
        public override Expression<Func<SingerAttention, bool>> GetByIdKey(int id)
        {
            return u => u.Id == id;
        }
    }
}
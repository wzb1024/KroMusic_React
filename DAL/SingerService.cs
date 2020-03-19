using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using Model;

namespace DAL
{
    public class SingerService : BaseService<Singer>
    {
        public SingerService(KroMusicEntities entities):base(entities)
        {

        }
        public override Expression<Func<Singer, bool>> GetByIdKey(int id)
        {
            return u => u.Id == id;
        }
    }
}

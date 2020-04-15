using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using Model;

namespace DAL
{
    public class MusicService : SqlBaseService<Music>
    {
        public MusicService(KroMusicEntities entities) : base(entities) { }
        public override Expression<Func<Music, bool>> GetByIdKey(int id)
        {
            return u => u.Id == id;
        }
    }
}

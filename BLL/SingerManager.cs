using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model;
using DAL;

namespace BLL
{
    public class SingerManager:BaseManager<Singer>
    {
        KroMusicEntities entities = new KroMusicEntities();
        public override BaseService<Singer> GetDAL()
        {
            return new SingerService(entities);
        }
        public IEnumerable<Singer> GetSingerByKeywords(string keywords)
        {
            return GetAllAsNoTracking().Where(u => u.Name.Contains(keywords));
        }
    }
}

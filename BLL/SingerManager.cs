using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model;
using DAL;

namespace BLL
{
    public class SingerJsonModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
    }
    public class SingerManager:BaseManager<Singer>
    {
        KroMusicEntities entities = new KroMusicEntities();
        public override SqlBaseService<Singer> GetDAL()
        {
            return new SingerService(entities);
        }
        public IEnumerable<Singer> GetSingerByKeywords(string keywords)
        {
            return GetAllAsNoTracking().Where(u => u.Name.Contains(keywords));
        }
    }
}

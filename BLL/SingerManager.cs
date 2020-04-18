using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model;
using DAL;
using IDAL;

namespace BLL
{
    public class SingerJsonModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
    }
    public class SingerManager
    {
        ISingerService service = DALFactory.DataAccess.CreateSingerrService();
        public IEnumerable<Singer> GetSingerByKeywords(string keywords)
        {
            return service.GetAllAsNoTracking().Where(u => u.Name.Contains(keywords));
        }
    }
}

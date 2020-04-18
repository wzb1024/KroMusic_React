using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAL
{
    public interface IBaseService<T> where T:class,new()
    {
        int Create(T model);
        int Edit(T model);
        IQueryable<T> GetAll();
         ParallelQuery<T> GetAllAsNoTracking();
        T GetById(int id);
        T GetByIdAsNoTracking(int id);
        int Remove(int id);
    }
}

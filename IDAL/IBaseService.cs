using System.Linq;

namespace IDAL
{
    public interface IBaseService<T> where T : class, new()
    {
        int Create(T model);
        int Edit(T model);
        IQueryable<T> GetAll();
        IQueryable<T> GetAllAsNoTracking();
        T GetById(int id);
        T GetByIdAsNoTracking(int id);
        int Remove(int id);
    }
}

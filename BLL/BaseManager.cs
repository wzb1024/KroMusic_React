using DAL;
using System.Linq;

namespace BLL
{
    public abstract partial class BaseManager<T> where T : class
    {
        BaseService<T> dal;
        public abstract BaseService<T> GetDAL();
        public BaseManager()
        {
            dal = GetDAL();
        }

        public IQueryable<T> GetAll()
        {
            return dal.GetAll();
        }
        public ParallelQuery<T> GetAllAsNoTracking()
        {
            return dal.GetAllAsNoTracking();
        }
        public T GetById(int id)
        {
            return dal.GetById(id);
        }

        public bool Add(T model)
        {
            return dal.Create(model) > 0;
        }
        public bool Edit(T model)
        {
            return dal.Edit(model) > 0;
        }
        public bool Remove(int id)
        {
            return dal.Remove(id) > 0;
        }
    }
}

using Model;
using System;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using IDAL;
namespace DAL
{
    public abstract partial class SqlBaseService<T>: IBaseService<T> where T :class,new()
    {
        private KroMusicEntities _db = DBContextFactory.GetContext();
        //private KroMusicEntities _db = new KroMusicEntities();
        public int Create(T model)
        {
            _db.Set<T>().Add(model);
            return _db.SaveChanges();
        }
        public int Edit(T model)
        {
            _db.Set<T>().Attach(model);
            _db.Entry<T>(model).State = EntityState.Modified;
            return _db.SaveChanges();
        }
        public IQueryable<T> GetAll()
        {
            return _db.Set<T>();
        }
        public ParallelQuery<T> GetAllAsNoTracking()
        {
            return _db.Set<T>().AsNoTracking().AsParallel();//并行查询，提高效率
        }
        //public IQueryable<T> GetAllAsNoTracking()
        //{
        //    return _db.Set<T>().AsNoTracking();
        //}
        public T GetById(int id)
        {
            return _db.Set<T>().Find(id);
        }
        public T GetByIdAsNoTracking(int id)
        {
            return _db.Set<T>().AsNoTracking().FirstOrDefault(GetByIdKey(id));
        }
        public int Remove(int id)
        {
            T item = GetById(id);
            _db.Entry<T>(item).State = EntityState.Deleted;
            return _db.SaveChanges();
        }
        public abstract Expression<Func<T, bool>> GetByIdKey(int id);
    }
}

using DAL;
using Model;
using System.Collections.Generic;
using System.Linq;

namespace BLL
{
    public class SubTypeModel
    {
        public string TypeName { get; set; }
        public List<Category> Categories = new List<Category>();
    }
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
    public class CategoryManager : BaseManager<Type>
    {
        KroMusicEntities entities = new KroMusicEntities();
        public override SqlBaseService<Type> GetDAL()
        {
            return new CategoryService(entities);
        }
        /// <summary>
        /// 获取全部分类，用于json数据
        /// </summary>
        /// <returns></returns>
        public List<SubTypeModel> GetAllCategories()
        {
            List<SubTypeModel> model = new List<SubTypeModel>();
            var all = GetAllAsNoTracking().ToList();
            foreach (var item in all)
            {
                SubTypeModel n = new SubTypeModel();
                n.TypeName = item.Name;
                foreach (var u in item.SubType)
                {
                    Category category = new Category();
                    category.Id = u.Id;
                    category.Name = u.Name;
                    n.Categories.Add(category);
                }
                model.Add(n);
            }
            return model;
        }
    }
    public class SubTypeManager : BaseManager<SubType>
    {
        KroMusicEntities entities = new KroMusicEntities();
        public override SqlBaseService<SubType> GetDAL()
        {
            return new SubTypeService(entities);
        }

    }
}

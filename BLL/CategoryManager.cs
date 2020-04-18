using DAL;
using IDAL;
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
    public class CategoryManager 
    {

        /// <summary>
        /// 获取全部分类，用于json数据
        /// </summary>
        /// <returns></returns>
        public List<SubTypeModel> GetAllCategories()
        {
            ITypeService service = DALFactory.DataAccess.CreateTypeService();
            List<SubTypeModel> model = new List<SubTypeModel>();
            var all = service.GetAllAsNoTracking().ToList();
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
}

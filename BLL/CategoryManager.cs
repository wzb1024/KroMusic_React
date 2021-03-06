﻿using IDAL;
using System.Collections.Generic;
using System.Linq;

namespace BLL
{

    public class CategoryManager
    {
        IType service = DALFactory.DataAccess.CreateTypeService();
        /// <summary>
        /// 获取全部分类，用于json数据
        /// </summary>
        /// <returns></returns>
        public List<SubTypeJsonModel> GetAllCategories()
        {

            List<SubTypeJsonModel> model = new List<SubTypeJsonModel>();
            var all = service.GetAllAsNoTracking().ToList();
            foreach (var item in all)
            {
                SubTypeJsonModel n = new SubTypeJsonModel();
                n.TypeName = item.Name;
                foreach (var u in item.SubType)
                {
                    CategoryJsonModel category = new CategoryJsonModel();
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

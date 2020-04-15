using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using IDAL;

namespace DALFactory
{
    public class DataAccess
    {
        private static string AssemblyName = ConfigurationManager.AppSettings["Path"].ToString();
        private static string db = ConfigurationManager.AppSettings["DB"].ToString();
        public static IUserService CreateUserService()
        {
            string className = AssemblyName + "." + db + "UserService";
            return (IUserService)Assembly.Load(AssemblyName).CreateInstance(className);
        }
    }
}

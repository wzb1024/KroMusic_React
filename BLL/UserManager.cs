using DAL;
using Model;
using System.Linq;

namespace BLL
{
    public partial class UserManager : BaseManager<User>
    {
        KroMusicEntities entities = new KroMusicEntities();
        public override BaseService<User> GetDAL()
        {
            return new UserService(entities);
        }
        public bool Success(string userName, string password)
        {
           return  GetAll().Any(m => m.UserName == userName && m.Password == password);
        }
        public int GetId(string userName)
        {
            return GetAll().First(m => m.UserName == userName).Id;
        }
        public User CheckName(string userName)
        {
            return GetAll().FirstOrDefault(m => m.UserName == userName);
        }
        public User CheckNikName(string nikName)
        {
            return GetAll().FirstOrDefault(m => m.NikName == nikName);
        }
        public bool Create(string userName,string password,string nikName,string gender,int age ,string email,string path)
        {
            User user = new User();
            user.UserName = userName;
            user.Password = password;
            user.NikName = nikName;
            user.Hdimage = path;
            user.Gender = gender;
            user.Age = age;
            user.Email = email;
            return Add(user);
        }
    }
}

using DAL;
using Model;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using System.Web;
using IDAL;
using DALFactory;

namespace BLL
{
    public class ModifyMsgJsonModel
    {
        [StringLength(6, MinimumLength = 3, ErrorMessage = "昵称长度为3~6")]
        public string NickName { get; set; }
        [EmailAddress]
        public string Email { get; set; }
        [Range(6, 99, ErrorMessage = "非法年龄！")]
        public int Age { get; set; }

    }

    public class AccountInfoJsonModel
    {
        public string Hdimage { get; set; }
        public string NickName { get; set; }
        public string Gender { get; set; }
        public int Age { get; set; }
        public string Email { get; set; }
    }
    public partial class UserManager
    {
        private UserManager() { }                                       //单例模式
        private static UserManager instance = new UserManager();
        public static UserManager Instance { get { return instance; } }

        IUserService service = DataAccess.CreateUserService();
        public User GetUserById(int id)
        {
            return service.GetById(id);
        }
        public bool Success(string userName, string password)
        {
            return service.GetAll().Any(m => m.UserName == userName && m.Password == password);
        }
        public int GetId(string userName)
        {
            return service.GetAll().First(m => m.UserName == userName).Id;
        }
        public User CheckName(string userName)
        {
            return service.GetAll().FirstOrDefault(m => m.UserName == userName);
        }
        public bool ExistNickName(string nickName)
        {
            return service.GetAll().FirstOrDefault(m => m.NickName == nickName) != null;
        }
        public bool ExistNickName(string nickName, int id)
        {
            return service.GetAll().FirstOrDefault(m => m.NickName == nickName && m.Id != id) != null;
        }
        public bool Create(string userName, string password, string nikName, string gender, int age, string email, string path)
        {
            User user = new User();
            user.UserName = userName;
            user.Password = password;
            user.NickName = nikName;
            user.Hdimage = path;
            user.Gender = gender;
            user.Age = age;
            user.Email = email;
            return service.Create(user)>0;
        }
        public AccountInfoJsonModel GetAccountMsg(int id)
        {
            AccountInfoJsonModel model;
            var user = service.GetById(id);
            model = new AccountInfoJsonModel { NickName = user.NickName, Age = user.Age, Email = user.Email, Gender = user.Gender, Hdimage = user.Hdimage };        
            return model;
        }
        public List<SongJsonModel> GetFavoriteMusics(int id)
        {
            List<SongJsonModel> model = new List<SongJsonModel>();
            var user = service.GetById(id);
            foreach (var item in user.FavoriteMusic)
            {
                SongJsonModel music = new SongJsonModel { Id = item.MusicId, ImagePath = item.Music.ImagePath, MusicName = item.Music.MusicName, Path = item.Music.Path, SingerName = item.Music.Singer.Name, Span = item.Music.Span.ToString().Remove(0, 3) };
                model.Add(music);
            }
            return model;
        }
       
        public List<SingerJsonModel> GetAttendSingers(int id)
        {
            List<SingerJsonModel> model = new List<SingerJsonModel>();
            var user = service.GetById(id);
            foreach (var item in user.Attention)
            {
                SingerJsonModel singer = new SingerJsonModel { Id = item.SingerId, Image = item.Singer.Image, Name = item.Singer.Name };
                model.Add(singer);
            }
            return model;
        }
        public void ChangeHdimage(string path,int id)
        {
            var user = service.GetById(id);             
            File.Delete(HttpContext.Current.Server.MapPath(user.Hdimage));
            user.Hdimage = path;
            service.Edit(user);
        }
        public bool ModifyMsg(ModifyMsgJsonModel model,int id)
        {
            var user = service.GetById(id);
            user.Age = model.Age;
            user.Email = model.Email;
            user.NickName = model.NickName;
            return service.Edit(user)>0;
        }
    }
}
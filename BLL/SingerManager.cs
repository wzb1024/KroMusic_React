using IDAL;
using Model;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BLL
{

    public class SingerManager
    {
        ISingerService service = DALFactory.DataAccess.CreateSingerrService();
        public IEnumerable<Singer> GetSingerByKeywords(string keywords)
        {
            return service.GetAllAsNoTracking().Where(u => u.Name.Contains(keywords)|| keywords.Contains(u.Name));
        }
        public SingerJsonModel GetDetails(int id)
        {

            var singer = service.GetByIdAsNoTracking(id);
            SingerJsonModel model = ConvertHelper.SingerConvert(singer);
            var self = UserManager.GetSelf();
            if (self != null)
            {
                model.Focused = self.SingerAttention.FirstOrDefault(it => it.SingerId == id) != null;

            }
            return model;
        }
        public List<SongJsonModel> GetSongs(int id)
        {
            var singer = service.GetByIdAsNoTracking(id);
            var songs = singer.Music.ToList();
            List<SongJsonModel> model = new List<SongJsonModel>();
            foreach (var item in songs)
            {
                SongJsonModel song = new SongJsonModel();
                song.Id = item.Id;
                song.MusicName = item.MusicName;
                song.Span = item.Span.ToString().Remove(0, 3);
                model.Add(song);
            }

            return model;
        }
        public void Create(string name, string nationality, string gender, int age, HttpPostedFileBase file)
        {
            Singer singer = new Singer();
            singer.Age = age;
            singer.CreatorId = UserManager.GetSelf().Id;
            singer.Gender = gender;
            singer.Nationality = nationality;
            singer.Name = name;
            string imgPath = "/Sourse/singer/" + name + ".jpg";
            string savepath = HttpContext.Current.Server.MapPath(imgPath);
            file.SaveAs(savepath);
            singer.Image = imgPath;
            service.Create(singer);
        }
    }
}

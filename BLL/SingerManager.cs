using DAL;
using IDAL;
using Model;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BLL
{

    public class SingerManager
    {
        ISinger service = DALFactory.DataAccess.CreateSingerrService();
        void saveChanges()
        {
            DBContextFactory.Context.SaveChanges();
        }
        public IQueryable<Singer> GetAllSingers(bool AsNoTracking = true)
        {
            if (AsNoTracking) return service.GetAllAsNoTracking();
            else return service.GetAll();
        }
        public Singer GetSinger(int id, bool AsNoTracking = true)
        {
            if (AsNoTracking) return service.GetByIdAsNoTracking(id);
            else return service.GetById(id);
        }
        public IEnumerable<Singer> GetSingerByKeywords(string keywords)
        {
            return GetAllSingers().Where(u => u.Name.Contains(keywords) || keywords.Contains(u.Name));
        }
        public SingerJsonModel GetDetails(int id)
        {

            var singer = GetSinger(id);
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
            var singer = GetSinger(id);
            var songs = singer.Music.ToList();
            List<SongJsonModel> model = new List<SongJsonModel>();
            foreach (var item in songs)
            {
                SongJsonModel song = new SongJsonModel();
                song.Id = item.Id;
                song.MusicName = item.MusicName;
                song.Span = item.Span.ToString().Remove(0, 3);
                song.Path = item.Path;
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
            string imgPath = Config.SingerCoverDir + name + ".jpg";
            string savepath = HttpContext.Current.Server.MapPath(imgPath);
            file.SaveAs(savepath);
            singer.Image = imgPath;
            service.Create(singer);
        }
        public List<SingerJsonModel> GetPopSingers()
        {
            List<SingerJsonModel> list = new List<SingerJsonModel>();
            var singers = GetAllSingers().OrderByDescending(u => u.SingerAttention.Count()).Take(15);
            foreach (var item in singers)
            {
                SingerJsonModel model = ConvertHelper.SingerConvert(item);
                list.Add(model);
            }
            return list;

        }
    }
}

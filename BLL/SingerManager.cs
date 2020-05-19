using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model;
using DAL;
using IDAL;
using System.Net.Http;
using System.Web;

namespace BLL
{

    public class SingerManager
    {
        ISingerService service = DALFactory.DataAccess.CreateSingerrService();
        public IEnumerable<Singer> GetSingerByKeywords(string keywords)
        {
            return service.GetAllAsNoTracking().Where(u => u.Name.Contains(keywords));
        }
        public SingerJsonModel GetDetails(int id)
        {
            
            var singer = service.GetByIdAsNoTracking(id);
            SingerJsonModel model = new SingerJsonModel();
            model.Id = singer.Id;
            model.Image = singer.Image;
            model.Name = singer.Name;
            model.Nationality = singer.Nationality;
            model.Profession = singer.Profession;
            model.Gender = singer.Gender;
            model.Age = singer.Age;
            model.Fans = singer.Attention.Count();
            model.Amount = singer.Music.Count();
            if (HttpContext.Current.Session["UserId"] != null)
            {
                KroMusicEntities entities = DBContextFactory.GetContext();
                int uid = int.Parse(HttpContext.Current.Session["UserId"].ToString());
                model.Focused = entities.Attention.FirstOrDefault(it => it.SingerId == id && it.UserId == uid) != null;
                
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
                song.MusicName = item.Singer.Name;
                song.Span = item.Span.ToString().Remove(0, 3);
                model.Add(song);
            }

            return model;
        }
    }
}

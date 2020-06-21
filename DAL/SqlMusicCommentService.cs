using IDAL;
using Model;
using System;
using System.Linq.Expressions;

namespace DAL
{
    public class SqlMusicCommentService : BaseService<MusicComment>, IMusicComment
    {
        public override Expression<Func<MusicComment, bool>> GetByIdKey(int id)
        {
            return u => u.Id == id;
        }
    }
}


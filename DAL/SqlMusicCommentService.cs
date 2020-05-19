﻿using System;
using IDAL;
using Model;
using System.Linq.Expressions;

namespace DAL
{
    public class SqlMusicCommentService : SqlBaseService<MusicComment>, IMusicCommentService
    {
        public override Expression<Func<MusicComment, bool>> GetByIdKey(int id)
        {
            return u => u.Id == id;
        }
    }
}

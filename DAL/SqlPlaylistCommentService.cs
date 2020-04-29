﻿using System;
using IDAL;
using Model;
using System.Linq.Expressions;

namespace DAL
{
    public class SqlPlaylistCommentService : SqlBaseService<PlaylistComment>, IPlaylistCommentService
    {
        public override Expression<Func<PlaylistComment, bool>> GetByIdKey(int id)
        {
            return u => u.Id == id;
        }
    }
}


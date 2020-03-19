using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KroMusic.Areas.Music.Data
{
    public class PlaylistModel
    {
        public int PlaylistId { get; set; }
        public string Owner { get; set; }
        public int OwnerId { get; set; }
        public string Cover { get; set; }
        public string Name { get; set; }
        public int PlayTimes { get; set; }
    }
}
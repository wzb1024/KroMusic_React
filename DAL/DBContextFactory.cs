using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Remoting.Messaging;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public class DBContextFactory
    {
        public static KroMusicEntities CreateContext()
        {
            KroMusicEntities dbContext = (KroMusicEntities)CallContext.GetData("dbContext");
            if(dbContext==null)
            {
                dbContext = new KroMusicEntities();
                CallContext.SetData("dbContext", dbContext);
            }
            return dbContext;
        }
    }
}

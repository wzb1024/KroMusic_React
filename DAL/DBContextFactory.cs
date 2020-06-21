using Model;
using System.Runtime.Remoting.Messaging;

namespace DAL
{
    public class DBContextFactory
    {
        public static KroMusicEntities Context
        {
            get
            {
                KroMusicEntities dbContext = (KroMusicEntities)CallContext.GetData("dbContext");
                if (dbContext == null)
                {
                    dbContext = new KroMusicEntities();
                    CallContext.SetData("dbContext", dbContext);
                }
                return dbContext;
            }

        }
    }
}

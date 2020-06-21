using System.Web.Mvc;

namespace KroMusic.Controllers
{
    public class ErrorController : Controller
    {
        // GET: Error
        public ActionResult Error404()
        {
            return PartialView();
        }
        public ActionResult Error500()
        {
            return View();
        }
    }
}
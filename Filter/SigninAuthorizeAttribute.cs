using System.Web.Mvc;

namespace KroMusic.Filter
{
    public class SigninAuthorizeAttribute : AuthorizeAttribute
    {
        public override void OnAuthorization(AuthorizationContext filterContext)
        {

            //判断登录情况
            if (filterContext.HttpContext.Session["UserId"] == null)
            {

                filterContext.Result = new JsonResult
                {
                    Data = new
                    {
                        State = false,
                        Message = "请先登录！"
                    },
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
            }
        }
    }
}
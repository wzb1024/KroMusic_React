﻿using System.Web.Mvc;

namespace KroMusic.Filter
{
    public class AjaxSyncActionAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {

            if (!filterContext.HttpContext.Request.IsAjaxRequest())
            {
                filterContext.Result = new RedirectResult("/Error/Error");
            }
        }
    }
}
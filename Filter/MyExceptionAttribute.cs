﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Policy;
using System.Web;
using System.Web.Mvc;
using log4net;

namespace KroMusic.Filter
{
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, Inherited = true, AllowMultiple = true)]
    public class MyExceptionAttribute:HandleErrorAttribute
    {
            ILog log = LogManager.GetLogger(typeof(MyExceptionAttribute));
        public override void OnException(ExceptionContext filterContext)
        {
            if (!filterContext.ExceptionHandled)
            {
                string message = string.Format("消息类型：{0}\r\n消息内容：{1}\r\n引发异常的方法：{2}\r\n引发异常源：{3}"
                , filterContext.Exception.GetType().Name
                , filterContext.Exception.Message
                , filterContext.Exception.TargetSite
                , filterContext.Exception.Source + filterContext.Exception.StackTrace
                );

                //记录日志
                log.Error(message);
                //转向
                filterContext.ExceptionHandled = true;
                filterContext.Result = new RedirectResult("/Error/Error_500");
            }
            base.OnException(filterContext);
        }
    }
}
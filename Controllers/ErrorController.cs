﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
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
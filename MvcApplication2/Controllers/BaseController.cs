using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MvcApplication2.Models;

namespace MvcApplication2.Controllers
{
    public class BaseController : Controller
    {
        //
        // GET: /Base/

        private ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// Gets the current site session.
        /// </summary>
        public SiteSession CurrentSiteSession
        {
            get
            {
                SiteSession hospitalSession = (SiteSession) this.Session["SiteSession"];
                return hospitalSession;
            }
        }

        /// <summary>
        /// Manage the internationalization before to invokes the action in the current controller context.
        /// </summary>
        protected override void ExecuteCore()
        {
            int culture = 0;
            if (this.Session == null || this.Session["CurrentUICulture"] == null)
            {
                int.TryParse(System.Configuration.ConfigurationManager.AppSettings["Culture"], out culture);
                this.Session["CurrentUICulture"] = culture;
            }
            else
            {
                culture = (int) this.Session["CurrentUICulture"];
            }
            //
            SiteSession.CurrentUICulture = culture;
            //
            // Invokes the action in the current controller context.
            //
            base.ExecuteCore();
        }

        protected override bool DisableAsyncSupport
        {
            get { return true; }
        }
    }
}

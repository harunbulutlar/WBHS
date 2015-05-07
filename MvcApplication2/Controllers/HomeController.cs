
using System.Web.Mvc;
using System.Web.Routing;
using Microsoft.Web.WebPages.OAuth;
using MvcApplication2.Filters;
using MvcApplication2.Models;
using WebMatrix.WebData;

namespace MvcApplication2.Controllers
{
    [InitializeSimpleMembership]   
    public class HomeController : BaseController
    {
        public ActionResult Index()
        {
            ViewBag.Message = Resources.Resource.Title;
            
            PatientModel model;
            if (User.IsInRole("Physician") | User.IsInRole("Technician"))
            {
                return RedirectToAction("Index","Physician", new {id = WebSecurity.GetUserId(User.Identity.Name)});
            }

            if (User.IsInRole("Patient"))
            {
                return RedirectToAction("Index", "Patient", new {id = WebSecurity.GetUserId(User.Identity.Name)});
            }
            if (User.IsInRole("Administrator"))
            {
                return RedirectToAction("Index", "Admin", new {id = WebSecurity.GetUserId(User.Identity.Name)});
            }
            using (var user = new UsersContext())
            {
                ViewData.Model = model = user.Patients.Find(WebSecurity.GetUserId(User.Identity.Name));
            }
            return View(model);
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your app description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        //
        // GET: /Account/Manage

        public ActionResult Edit()
        {
            ViewBag.HasLocalPassword = OAuthWebSecurity.HasLocalAccount(WebSecurity.GetUserId(User.Identity.Name));
            return RedirectToAction("Edit", "Patient", new {id = WebSecurity.GetUserId(User.Identity.Name)});
        }
    }
}

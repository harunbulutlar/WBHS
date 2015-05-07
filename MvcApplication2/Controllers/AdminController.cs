using System;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Web.Mvc;
using MvcApplication2.Models;
using PagedList;

namespace MvcApplication2.Controllers
{
    public class AdminController : BaseController
    {
        private UsersContext db = new UsersContext();

        //
        // GET: /Admin/

        public ActionResult Index(string sortOrder, string currentFilter, string searchString, int? page)
        {
            ViewBag.CurrentSort = sortOrder;
            ViewBag.NameSortParm = String.IsNullOrEmpty(sortOrder) ? "name_desc" : "";
            ViewBag.DateSortParm = sortOrder == "Date" ? "date_desc" : "Date";

            if (searchString != null)
            {
                page = 1;
            }
            else
            {
                searchString = currentFilter;
            }

            ViewBag.CurrentFilter = searchString;

            var patients = from s in db.UserProfiles
                           where !s.AccountType.Equals("Patient") select s;
            if (!String.IsNullOrEmpty(searchString))
            {
                var upperString = searchString.ToUpper();
                patients = patients.Where(s => s.Surname.ToUpper().Contains(upperString)
                                       || s.Name.ToUpper().Contains(upperString));
            }
            switch (sortOrder)
            {
                case "name_desc":
                    patients = patients.OrderByDescending(s => s.Surname);
                    break;
                default:  // Name ascending 
                    patients = patients.OrderBy(s => s.Surname);
                    break;
            }

            int pageSize = 3;
            int pageNumber = (page ?? 1);
            return View(patients.ToPagedList(pageNumber, pageSize));
        }

        //
        // GET: /Admin/Details/5

        public ActionResult Details(int id = 0)
        {
            UserProfile userprofile = db.UserProfiles.Find(id);
            if (userprofile == null)
            {
                return HttpNotFound();
            }
            return View(userprofile);
        }

        //
        // GET: /Admin/Create

        public ActionResult Create()
        {
            var model = new UserProfile
            {
                AccountTypes = new[]
                {
                    new SelectListItem {Value = "Patient", Text = "Patient"},
                    new SelectListItem {Value = "Physician", Text = "Physician"},
                    new SelectListItem {Value = "Technician", Text = "Lab Technician"},
                    new SelectListItem {Value = "Administrator", Text = "Administrator"},
                }
            };
            return View(model);
        }

        //
        // POST: /Admin/Create

        [HttpPost]
        public ActionResult Create(UserProfile userprofile)
        {
            if (ModelState.IsValid)
            {
                db.UserProfiles.Add(userprofile);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(userprofile);
        }

        //
        // GET: /Admin/Edit/5

        public ActionResult Edit(int id = 0)
        {
            UserProfile userprofile = db.UserProfiles.Find(id);
            if (userprofile == null)
            {
                return HttpNotFound();
            }
            return View(userprofile);
        }

        //
        // POST: /Admin/Edit/5

        [HttpPost]
        public ActionResult Edit(UserProfile userprofile)
        {
            if (ModelState.IsValid)
            {
                db.Entry(userprofile).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(userprofile);
        }

        //
        // GET: /Admin/Delete/5

        public ActionResult Delete(int id = 0)
        {
            UserProfile userprofile = db.UserProfiles.Find(id);
            if (userprofile == null)
            {
                return HttpNotFound();
            }
            return View(userprofile);
        }

        //
        // POST: /Admin/Delete/5

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(int id)
        {
            UserProfile userprofile = db.UserProfiles.Find(id);
            db.UserProfiles.Remove(userprofile);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}
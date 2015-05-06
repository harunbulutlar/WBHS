using System;
using System.Data;
using System.Linq;
using System.Web.Mvc;
using MvcApplication2.Models;
using PagedList;

namespace MvcApplication2.Controllers
{
    public class StaffController : Controller
    {
        private UsersContext db = new UsersContext();

        //
        // GET: /Staff/

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

            var patients = from s in db.Patients
                           select s;
            if (!String.IsNullOrEmpty(searchString))
            {
                patients = patients.Where(s => s.Surname.ToUpper().Contains(searchString.ToUpper())
                                       || s.Name.ToUpper().Contains(searchString.ToUpper()));
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
        // GET: /Staff/Details/5

        public ActionResult Details(int id = 0)
        {
            PatientModel userprofile = db.Patients.Find(id);
            if (userprofile == null)
            {
                return HttpNotFound();
            }
            return View(userprofile);
        }

        //
        // GET: /Staff/Edit/5

        public ActionResult Edit(int id = 0)
        {
            PatientModel userprofile = db.Patients.Find(id);
            if (userprofile == null)
            {
                return HttpNotFound();
            }
            return View(userprofile);
        }

        //
        // POST: /Staff/Edit/5

        [HttpPost]
        public ActionResult Edit(PatientModel userprofile)
        {
            if (ModelState.IsValid)
            {
                db.Entry(userprofile).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index", "Staff");
            }
            return View(userprofile);
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}
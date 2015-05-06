using System;
using System.Data;
using System.Dynamic;
using System.IO;
using System.Linq;
using System.Web.Mvc;
using MvcApplication2.Models;
using PagedList;

namespace MvcApplication2.Controllers
{
    public class PatientController : Controller
    {
        private UsersContext db = new UsersContext();

        //
        // GET: /Patient/

        public ActionResult Index(string sortOrder, string currentFilter, string searchString, int? page,int id = 0)
        {
            var patientmodel = db.Patients.Find(id);
            ViewData.Model = patientmodel;
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

            var physicians = from s in db.Physicians
                           select s;
            if (!String.IsNullOrEmpty(searchString))
            {
                physicians = physicians.Where(s => s.Surname.ToUpper().Contains(searchString.ToUpper())
                                       || s.Name.ToUpper().Contains(searchString.ToUpper()));
            }
            switch (sortOrder)
            {
                case "name_desc":
                    physicians = physicians.OrderByDescending(s => s.Surname);
                    break;
                default:  // Name ascending 
                    physicians = physicians.OrderBy(s => s.Surname);
                    break;
            }

            int pageSize = 3;
            int pageNumber = (page ?? 1);
            dynamic mymodel = new ExpandoObject();
            mymodel.Patient = patientmodel;
            ViewData["Physicians"] = physicians.ToPagedList(pageNumber, pageSize); ;
            return View(patientmodel);
        }

        //
        // GET: /Patient/Details/5

        public ActionResult Details(int id = 0)
        {
            PatientModel patientmodel = db.Patients.Find(id);
            if (patientmodel == null)
            {
                return HttpNotFound();
            }
            return View(patientmodel);
        }

        //
        // GET: /Patient/Edit/5

        public ActionResult Edit(int id = 0)
        {
            PatientModel patientmodel = db.Patients.Find(id);
            if (patientmodel == null)
            {
                return HttpNotFound();
            }
            return View(patientmodel);
        }

        //
        // POST: /Patient/Edit/5

        [HttpPost]
        public ActionResult Edit(PatientModel patientmodel)
        {
            if (!ModelState.IsValid) return View(patientmodel);
            if (patientmodel.PhotoInternal != null)
            {
                using (var inputStream = patientmodel.PhotoInternal.InputStream)
                {
                    var memoryStream = inputStream as MemoryStream;
                    if (memoryStream == null)
                    {
                        memoryStream = new MemoryStream();
                        inputStream.CopyTo(memoryStream);
                    }
                    patientmodel.Photo = memoryStream.ToArray();
                }
            }

            db.Entry(patientmodel).State = EntityState.Modified;
            db.SaveChanges();
            return RedirectToAction("Index", "Home", new {id = patientmodel.UserId});
        }

        public ActionResult Schedule(int physicianId = 0, int patientId = 0)
        {
            var physician = db.Physicians.Find(physicianId);
            if (physician == null)
            {
                return HttpNotFound();
            }
            return RedirectToAction("Index", "Calendar", new { physicianId, patientId });
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }

    }
}
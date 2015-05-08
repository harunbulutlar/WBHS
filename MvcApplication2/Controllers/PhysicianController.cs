using System.Data;
using System.Web.Mvc;
using MvcApplication2.Models;

namespace MvcApplication2.Controllers
{
    public class PhysicianController : BaseController
    {
        private UsersContext db = new UsersContext();

        //
        // GET: /Physician/

        public ActionResult Index(int id = 0)
        {
            var physicianmodel = db.Physicians.Find(id);
            ViewData.Model = physicianmodel;
            return View(physicianmodel);
        }
        
        //
        // GET: /Physician/Details/5

        public ActionResult Details(int id = 0)
        {
            var physicianmodel = db.Physicians.Find(id);
            if (physicianmodel == null)
            {
                return HttpNotFound();
            }
            return View(physicianmodel);
        }

        //
        // GET: /Physician/Create

        public ActionResult Create()
        {
            return View();
        }

        //
        // POST: /Physician/Create

        [HttpPost]
        public ActionResult Create(PhysicianModel physicianmodel)
        {
            if (ModelState.IsValid)
            {
                db.UserProfiles.Add(physicianmodel);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(physicianmodel);
        }

        //
        // GET: /Physician/Edit/5

        public ActionResult Edit(int id = 0)
        {
            PhysicianModel physicianmodel = db.Physicians.Find(id);
            if (physicianmodel == null)
            {
                return HttpNotFound();
            }
            return View(physicianmodel);
        }

        //
        // POST: /Physician/Edit/5

        [HttpPost]
        public ActionResult Edit(PhysicianModel physicianmodel)
        {
            if (ModelState.IsValid)
            {
                db.Entry(physicianmodel).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(physicianmodel);
        }

        public ActionResult Calendar(int id = 0)
        {
            return RedirectToAction("Index", "PhysicianCalendar",new { physicianId = id});
        }
        //
        // GET: /Physician/Delete/5

        public ActionResult Delete(int id = 0)
        {
            PhysicianModel physicianmodel = db.Physicians.Find(id);
            if (physicianmodel == null)
            {
                return HttpNotFound();
            }
            return View(physicianmodel);
        }

        //
        // POST: /Physician/Delete/5

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(int id)
        {
            PhysicianModel physicianmodel = db.Physicians.Find(id);
            db.UserProfiles.Remove(physicianmodel);
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
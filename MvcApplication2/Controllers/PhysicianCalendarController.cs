﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using DHTMLX.Common;
using DHTMLX.Scheduler;
using DHTMLX.Scheduler.Controls;
using DHTMLX.Scheduler.Data;
using MvcApplication2.Models;

namespace MvcApplication2.Controllers
{
    public class PhysicianCalendarController : Controller
    {
        private UsersContext db = new UsersContext();
        private static int _physicianId = 0;
        public ActionResult Index(int physicianId = 0)
        {
            _physicianId = physicianId;
            var physicianModel = db.Physicians.Find(physicianId);
            ViewData["Physician"] = physicianModel;
            //Being initialized in that way, scheduler will use CalendarController.Data as a the datasource and CalendarController.Save to process changes
            var scheduler = new DHXScheduler(this)
            {
                LoadData = true,
                EnableDataprocessor = true,
            };
            scheduler.BeforeInit.Add(string.Format("initResponsive({0})", scheduler.Name));
            scheduler.AfterInit = new List<string> { "app.initialize();" };

            return View(scheduler);
        }

        public ContentResult Data()
        {
            var physicianModel = db.Physicians.Find(_physicianId);
            var data = new SchedulerAjaxData(physicianModel.Appointments.ToList());
            return data;
        }

        public ContentResult Save(CalendarEvent updatedEvent, FormCollection actionValues)
        {
            var physicianModel = db.Physicians.Find(_physicianId);
            var action = new DataAction(actionValues);
            try
            {
                switch (action.Type)
                {
                    case DataActionTypes.Insert:
                        updatedEvent.EventCreator = physicianModel;
                        updatedEvent.EventType = "blocker";
                        updatedEvent.CreationDate = DateTime.Now;
                        physicianModel.Appointments.Add(updatedEvent);

                        break;
                    case DataActionTypes.Delete:
                        var physicianBlocker = physicianModel.Appointments.First(appointment => appointment.EventCreator.UserId == physicianModel.UserId && appointment.id == updatedEvent.id);
                        physicianModel.Appointments.Remove(physicianBlocker);
                        //do delete
                        break;
                    default: // "update"
                        {
                            var appointmentForPatient = physicianModel.Appointments.First(appointment => appointment.EventCreator == updatedEvent.EventCreator);
                            if (appointmentForPatient != null)
                            {
                                updatedEvent.CreationDate = DateTime.Now;
                                UpdateModel(updatedEvent);

                            }

                            break;
                        }
                }
                db.SaveChanges();
                action.TargetId = updatedEvent.id;
            }
            catch
            {
                action.Type = DataActionTypes.Error;
            }
            return new AjaxSaveResponse(action);
        }
    }
}


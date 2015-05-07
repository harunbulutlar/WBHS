using System;
using System.Collections.Generic;
using System.Data.Entity.Migrations;
using System.Data.Entity.Validation;
using System.Diagnostics;
using System.Linq;
using System.Web.Security;
using MvcApplication2.Models;
using WebMatrix.WebData;

namespace MvcApplication2.Migrations
{
    internal sealed class Configuration : DbMigrationsConfiguration<UsersContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
        }

        protected override void Seed(UsersContext context)
        {
            WebSecurity.InitializeDatabaseConnection(
                "DefaultConnection51",
                "UserProfile",
                "UserId",
                "UserName", true);

            if (!Roles.RoleExists("Administrator"))
                Roles.CreateRole("Administrator");

            if (!Roles.RoleExists("Patient"))
                Roles.CreateRole("Patient");

            if (!Roles.RoleExists("Physician"))
                Roles.CreateRole("Physician");

            if (!Roles.RoleExists("Technician"))
                Roles.CreateRole("Technician");


            if (!WebSecurity.UserExists("defaultpatient@gmail.com"))
            {
                var patient = new PatientModel
                {
                    UserName = "defaultpatient@gmail.com",
                    Birthday = DateTime.Now,
                    PhoneNumber = "default",
                    Name = "default",
                    Surname = "default",
                    HomeAddress = "default",
                    TcCitizenshipNo = "default",
                    AccountType = "Patient",
                };
                context.Patients.Add(patient);
                context.SaveChanges();
                WebSecurity.CreateAccount(patient.UserName, "password");
                Roles.AddUserToRole(patient.UserName, "Patient");
            }
            if (!WebSecurity.UserExists("defaultpatient2@gmail.com"))
            {
                var patient = new PatientModel
                {
                    UserName = "defaultpatient2@gmail.com",
                    Birthday = DateTime.Now,
                    PhoneNumber = "default2",
                    Name = "default2",
                    Surname = "default2",
                    HomeAddress = "default2",
                    TcCitizenshipNo = "default2",
                    AccountType = "Patient",
                };
                context.Patients.Add(patient);
                context.SaveChanges();
                WebSecurity.CreateAccount(patient.UserName, "password");
                Roles.AddUserToRole(patient.UserName, "Patient");
            }
            if (!WebSecurity.UserExists("defaultphysician@gmail.com"))
            {

                var physician = new PhysicianModel
                {
                    UserName = "defaultphysician@gmail.com",
                    PhoneNumber = "default",
                    Name = "default",
                    Surname = "default",
                    Birthday = DateTime.Now,
                    HomeAddress = "default",
                    TcCitizenshipNo = "default",
                    AccountType = "Physician",
                    Appointments = new List<CalendarEvent>()
                };
                context.Physicians.Add(physician);
                try
                {
                    // Your code...
                    // Could also be before try if you know the exception occurs in SaveChanges

                    context.SaveChanges();
                }
                catch (DbEntityValidationException e)
                {
                    foreach (var eve in e.EntityValidationErrors)
                    {
                        if (Debugger.IsAttached == false)
                            Debugger.Launch();
                        Debug.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                            eve.Entry.Entity.GetType().Name, eve.Entry.State);
                        foreach (var ve in eve.ValidationErrors)
                        {
                            Debug.WriteLine("- Property: \"{0}\", Error: \"{1}\"",
                                ve.PropertyName, ve.ErrorMessage);
                        }
                    }
                    throw;
                }
                WebSecurity.CreateAccount(physician.UserName, "password");
                Roles.AddUserToRole(physician.UserName, "Physician");
            }

            if (!WebSecurity.UserExists("defaulttechnician@gmail.com"))
            {
                WebSecurity.CreateUserAndAccount(
                    "defaulttechnician@gmail.com",
                    "password",
                    new
                    {
                        PhoneNumber = "default",
                        Name = "default",
                        Surname = "default",
                        Birthday = (DateTime?)DateTime.Now,
                        HomeAddress = "default",
                        TcCitizenshipNo = "default",
                        AccountType = "Technician"
                    });
            }
            if (!WebSecurity.UserExists("defaultadmin@gmail.com"))
            {
                WebSecurity.CreateUserAndAccount(
                    "defaultadmin@gmail.com",
                    "password",
                    new
                    {
                        PhoneNumber = "default",
                        Name = "default",
                        Surname = "default",
                        Birthday = (DateTime?)DateTime.Now,
                        HomeAddress = "default",
                        TcCitizenshipNo = "default",
                        AccountType = "Administrator"
                    });
            }
            if (!Roles.GetRolesForUser("defaultadmin@gmail.com").Contains("Administrator"))
                Roles.AddUsersToRoles(new[] { "defaultadmin@gmail.com" }, new[] { "Administrator" });
            if (!Roles.GetRolesForUser("defaultpatient@gmail.com").Contains("Patient"))
                Roles.AddUsersToRoles(new[] { "defaultpatient@gmail.com" }, new[] { "Patient" });
            if (!Roles.GetRolesForUser("defaultphysician@gmail.com").Contains("Physician"))
                Roles.AddUsersToRoles(new[] { "defaultphysician@gmail.com" }, new[] { "Physician" });
            if (!Roles.GetRolesForUser("defaulttechnician@gmail.com").Contains("Technician"))
                Roles.AddUsersToRoles(new[] { "defaulttechnician@gmail.com" }, new[] { "Technician" });
        }

    }

}

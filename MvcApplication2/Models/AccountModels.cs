using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Web;
using System.Web.Mvc;

#if USE_LOCAL_RESOURCE
using MvcApplication2.App_GlobalResources;
#else
using Resources;
#endif

namespace MvcApplication2.Models
{
    public class UsersContext : DbContext
    {
        public UsersContext()
            : base("DefaultConnection52")
        {
        }

        public DbSet<UserProfile> UserProfiles { get; set; }
        public DbSet<PatientModel> Patients { get; set; }
        public DbSet<PhysicianModel> Physicians { get; set; }
        public DbSet<CalendarEvent> Appointments { get; set; }
    }

    public class PhysicianModel:UserProfile
    {
        public virtual List<CalendarEvent> Appointments { get; set; }
    }

    [Table("UserProfile")]
    public class UserProfile
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserId { get; set; }

        [Required]
        [DataType(DataType.EmailAddress)]
        [Display(Name = "Email")]
        [EmailAddress(ErrorMessage = "Invalid Email Address")]
        public string UserName { get; set; }
        
        [Required]
        [Display(Name = "Turkish Citizenship Number")]
        public string TcCitizenshipNo { get; set; }

        [Required]
        [Display(Name = "Name")]
        public string Name { get; set; }

        [Required]
        [Display(Name = "Surname")]
        public string Surname { get; set; }

        [Required]
        [DataType(DataType.PhoneNumber)]
        [Display(Name = "Phone Number")]
        public string PhoneNumber { get; set; }

        [Required]
        [DataType(DataType.MultilineText)]
        [Display(Name = "Home Address")]
        public string HomeAddress { get; set; }

        [Required]
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        [Display(Name = "Birthday")]
        public DateTime? Birthday { get; set; }

        [Display(Name = "Account Type")]
        public string AccountType { get; set; }
        public IEnumerable<SelectListItem> AccountTypes = new[]
        {
            new SelectListItem {Value = "Patient", Text = "Patient"},
            new SelectListItem {Value = "Physician", Text = "Physician"},
            new SelectListItem {Value = "Technician", Text = "Lab Technician"},
            new SelectListItem {Value = "Administrator", Text = "Administrator"},
        };

    }

    public class LocalPasswordModel
    {
        [Required]
        [DataType(DataType.Password)]
        public string OldPassword { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        public string NewPassword { get; set; }

        [DataType(DataType.Password)]
        [System.ComponentModel.DataAnnotations.Compare("NewPassword", ErrorMessage = "The new password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }
    }

    public class LoginModel
    {
        [Required]
        [HiddenInput(DisplayValue = false)]
        public string UserName { get; set; }

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        public bool RememberMe { get; set; }
    }

    public class RegisterModel:UserProfile
    {
        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$", ErrorMessage = "Password must contain at least one upper case letter, one lower case letter, one digit and one special character.")]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [System.ComponentModel.DataAnnotations.Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }


    }

    [Table("Patient")]
    public class PatientModel : UserProfile
    {
        public void Initilize(UserProfile user)
        {
            Birthday = user.Birthday;
            HomeAddress = user.HomeAddress;
            Name = user.Name;
            PhoneNumber = user.PhoneNumber;
            Surname = user.Surname;
            TcCitizenshipNo = user.TcCitizenshipNo;
            UserId = user.UserId;
            UserName = user.UserName;
        }

        [DataType(DataType.MultilineText)]
        public string Vaccinations { get; set; }
        [DataType(DataType.MultilineText)]
        public string Treathments { get; set; }
        [Range(0,300, ErrorMessage = "Height must be between 0 and 300 cm")]
        public int? Height { get; set; }
        [Range(0, 300, ErrorMessage = "Weight must be between 0 and 300 cm")]
        public int? Weight { get; set; }
        public string Gender { get; set; }


        public byte[] Photo { get; set; }

        [NotMapped, DataType(DataType.Upload)]
        public HttpPostedFileBase PhotoInternal { get; set; }

        public string CurrentMedications { get; set; }
        public string InconvenientMedications { get; set; }
        [DataType(DataType.MultilineText)]
        public string Allergies { get; set; }
        public string Surgeries { get; set; }
        [DataType(DataType.MultilineText)]
        public string Diseases { get; set; }
        [DataType(DataType.MultilineText)]
        public string Disorders { get; set; }

        [DataType(DataType.MultilineText)]
        public string LabResults { get; set; }
        public IEnumerable<SelectListItem> Genders = new[]
        {
            new SelectListItem {Value = Resource.Male, Text = Resource.Male},
            new SelectListItem {Value = Resource.Female, Text = Resource.Female},
        };
        public bool IsVisitationInformationPrivate { get; set; }
    }
}

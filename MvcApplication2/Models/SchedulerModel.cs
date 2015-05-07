using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DHTMLX.Scheduler;

namespace MvcApplication2.Models
{
    [Table("CalendarEvent")]
    public class CalendarEvent
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [DHXJson(Alias = "id")]
        public int id { get; set; }
        public string text { get; set; }
        public DateTime start_date { get; set; }
        public DateTime end_date { get; set; }
        public int CreatorId { get; set; }
        public DateTime CreationDate { get; set; }
        public string EventType { get; set; }
    }
}
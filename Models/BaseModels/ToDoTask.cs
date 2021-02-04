using System;
using System.ComponentModel.DataAnnotations;
using just_do.Enums;

namespace just_do.Models.BaseModels
{
    public class ToDoTask
    {
        [Key]
        public string TaskId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public TaskPriority priority { get; set; }
        public DateTime dateTime { get; set; }
        public string UserId { get; set; }
    }
}

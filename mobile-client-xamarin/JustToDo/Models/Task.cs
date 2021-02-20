using System;

namespace JustToDo.Models
{
    public class ToDoTask
    {
        public string TaskId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public TaskPriority priority { get; set; }
        public DateTime dateTime { get; set; }
        public string UserId { get; set; }
    }

    public class NewToDoTask
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public TaskPriority priority { get; set; }
        public DateTime dateTime { get; set; }
        public string UserId { get; set; }
    }
}
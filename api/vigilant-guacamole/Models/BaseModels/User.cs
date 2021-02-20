using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace just_do.Models.BaseModels
{
    public class User : IdentityUser
    {
        public override string Email { get; set; }
        public List<ToDoTask> Tasks { get; set; }
    }
}
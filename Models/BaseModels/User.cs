using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace just_do.Models.BaseModels
{
    public class User : IdentityUser
    {
        [Key]
        public override string Email { get; set; }
    }
}
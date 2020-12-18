using System.ComponentModel.DataAnnotations;

namespace just_do.Models.ActionModels
{
    public class RegisterModel
    {
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
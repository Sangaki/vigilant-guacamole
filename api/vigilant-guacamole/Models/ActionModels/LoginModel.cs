using System.ComponentModel.DataAnnotations;

namespace just_do.Models.ActionModels
{
    public class LoginModel
    {
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
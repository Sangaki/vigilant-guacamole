using System.ComponentModel.DataAnnotations;

namespace just_do.Models.ActionModels.Authentication
{
    public class RefreshToken
    {
        [Key]
        public string Username { get; set; }
        public string Token { get; set; }
        public bool Revoked { get; set; }
    }
}

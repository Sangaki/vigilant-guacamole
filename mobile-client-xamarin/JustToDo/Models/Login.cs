using Xamarin.Essentials;

namespace JustToDo.Models
{
    public class LoginModel
    {
        public string email { get; }
        public string password { get; }

        public LoginModel(string email, string password)
        {
            this.email = email;
            this.password = password;
        }
    }

    public class JsonWebToken
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        public long Expires { get; set; }
        public string userId { get; set; }
    }

    public class TokenDto
    {
        public string token { get; set; }

        public TokenDto(string token)
        {
            this.token = token;
        }
    }
}
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace just_do.Options
{
    public class AuthOptions
    {
        const string KEY = "mysupersecret_secretkey!123";
        public const int LIFETIME = 2400;
        public static SymmetricSecurityKey GetSymmetricSecurityKey()
        {
            return new SymmetricSecurityKey(Encoding.ASCII.GetBytes(KEY));
        }
    }
}
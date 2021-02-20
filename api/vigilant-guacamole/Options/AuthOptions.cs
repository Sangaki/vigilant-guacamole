using System.Text;
using just_do.Services;
using Microsoft.IdentityModel.Tokens;

namespace just_do.Options
{
    public class AuthOptions
    {
        public static SymmetricSecurityKey GetSymmetricSecurityKey()
        {
            return new SymmetricSecurityKey(Encoding.ASCII.GetBytes(ConfigurationManager.AppSetting["jwt:secretKey"]));
        }
    }
}
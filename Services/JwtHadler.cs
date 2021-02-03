using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using IdentityModel;
using just_do.Models;
using just_do.Models.BaseModels;
using just_do.Options;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace just_do.Services
{
    public interface IJwtHandler
    {
        Models.JsonWebToken Create(User person);
    }
    public class JwtHandler : IJwtHandler
    {
        private readonly JwtOptions _options;
        private readonly JwtSecurityTokenHandler _jwtSecurityTokenHandler = new JwtSecurityTokenHandler();
        private readonly SecurityKey _securityKey;
        private readonly SigningCredentials _signingCredentials;
        private readonly JwtHeader _jwtHeader;

        public JwtHandler(IOptions<JwtOptions> options)
        {
            _options = options.Value;
            _securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.SecretKey));
            _signingCredentials = new SigningCredentials(_securityKey, SecurityAlgorithms.HmacSha256);
            _jwtHeader = new JwtHeader(_signingCredentials);
        }

        public JsonWebToken Create(User person)
        {
            var nowUtc = DateTime.UtcNow;
            var expires = nowUtc.Add(TimeSpan.FromMinutes(double.Parse(ConfigurationManager.AppSetting["jwt:expiryMinutes"])));
            var centuryBegin = new DateTime(1970, 1, 1).ToUniversalTime();
            var exp = (long)(new TimeSpan(expires.Ticks - centuryBegin.Ticks).TotalSeconds);
            var jwt = new JwtSecurityToken(
                    notBefore: nowUtc,
                    claims: GetIdentity(person).Claims,
                    expires: expires,
                    signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256));
            var token = _jwtSecurityTokenHandler.WriteToken(jwt);

            return new JsonWebToken
            {
                AccessToken = token,
                Expires = exp
            };
        }
        private ClaimsIdentity GetIdentity(User person)
        {
            if (person != null)
            {
                var claims = new List<Claim>
                {
                    new Claim(JwtClaimTypes.Subject, person.Id),
                    new Claim(ClaimsIdentity.DefaultNameClaimType, person.Email),
                };
                ClaimsIdentity claimsIdentity =
                    new ClaimsIdentity(claims, "Token", ClaimsIdentity.DefaultNameClaimType,
                        ClaimsIdentity.DefaultRoleClaimType);
                return claimsIdentity;
            }

            return null;
        }
    }
}

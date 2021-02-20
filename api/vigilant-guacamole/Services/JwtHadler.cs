using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using IdentityModel;
using just_do.Models.ActionModels.Authentication;
using just_do.Models.BaseModels;
using just_do.Options;
using Microsoft.IdentityModel.Tokens;

namespace just_do.Services
{
    public interface IJwtHandler
    {
        JsonWebToken Create(User person);
    }
    public class JwtHandler : IJwtHandler
    {
        private readonly JwtSecurityTokenHandler _jwtSecurityTokenHandler = new JwtSecurityTokenHandler();

        public JwtHandler()
        {
        }

        public JsonWebToken Create(User person)
        {
            if (person == null)
            {
                throw new Exception("Not implemented yet!");
            }

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
                Expires = exp,
                userId = person.Id
            };
        }
        private ClaimsIdentity GetIdentity(User person)
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
    }
}

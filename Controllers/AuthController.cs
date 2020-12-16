using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using just_do.Contexts;
using just_do.Models.ActionModels;
using just_do.Models.BaseModels;
using just_do.Options;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace just_do.Controllers
{
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        private readonly ApplicationContext _context;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        
        public AuthController(
            ApplicationContext context, 
            UserManager<User> userManager, 
            SignInManager<User> signInManager)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
        }
        
        [HttpPost, Route("login")]
        public async Task<IActionResult> Login([FromBody]LoginModel user)
        {
            if (user == null)
            {
                return BadRequest("Invalid client request");
            }
            
            var userEntity = await _context.Users
                .FirstOrDefaultAsync(a => a.Email == user.Email);
            if (userEntity == null)
            {
                return NotFound();
            }
            var passwordHasher = new PasswordHasher<User>();
            var passwordVerificationResult = passwordHasher.VerifyHashedPassword(userEntity, userEntity.PasswordHash, user.Password);
            
            if (passwordVerificationResult == PasswordVerificationResult.Success)
            {
                var now = DateTime.UtcNow;
                // создаем JWT-токен
                var jwt = new JwtSecurityToken(
                    notBefore: now,
                    claims: GetIdentity(user.Email).Claims,
                    expires: now.Add(TimeSpan.FromMinutes(AuthOptions.LIFETIME)),
                    signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256));
                var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);
            
                var response = new
                {
                    token = encodedJwt,
                };
                return Ok(response);
            }

            return BadRequest();
        }
        
        [HttpPost, Route("register")]
        public async Task<IActionResult> Register([FromBody]RegisterModel user)
        {
            if (user == null)
            {
                return BadRequest("Invalid client request");
            }

            var identityUser = new User { Email = user.Email, UserName = user.Email };
            
            var registerResult = await _userManager.CreateAsync(identityUser, user.Password);
            
            if (!registerResult.Succeeded) return BadRequest();

            return Ok();
        }
        
        private ClaimsIdentity GetIdentity(string email)
        {
            User person = _context.Users.FirstOrDefault(x => x.Email == email);
            if (person != null)
            {
                var claims = new List<Claim>
                {
                    new Claim(ClaimsIdentity.DefaultNameClaimType, person.Email),
                    new Claim("sub", person.Id)
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

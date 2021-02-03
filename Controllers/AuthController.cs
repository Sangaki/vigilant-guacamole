using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using just_do.Contexts;
using just_do.Middlewares;
using just_do.Models;
using just_do.Models.ActionModels;
using just_do.Models.BaseModels;
using just_do.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace just_do.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationContext _context;
        private readonly IAccountService _accountService;
        private readonly ITokenManager _tokenManager;

        public AuthController(
            ApplicationContext context,
            IAccountService accountService,
            ITokenManager tokenManager)
        {
            _context = context;
            _accountService = accountService;
            _tokenManager = tokenManager;
        }

        [HttpPost("sign-up")]
        [AllowAnonymous]
        public IActionResult SignUp([FromBody] RegisterModel request)
        {
            _accountService.SignUp(request.Email, request.Password);

            return NoContent();
        }

        [HttpPost("sign-in")]
        [AllowAnonymous]
        public async Task<ActionResult<JsonWebToken>> SignInAsync([FromBody] LoginModel user)
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
                return Ok(_accountService.SignIn(userEntity));
            }

            return BadRequest();
        }

        [HttpPost("tokens/refresh")]
        [AllowAnonymous]
        public async Task<ActionResult<JsonWebToken>> RefreshAccessToken([FromBody] TokenDto tokenDto)
        {
            var userId = HttpContext.User.Claims.First().Value;
            var user = await _context.Users.FirstOrDefaultAsync(a => a.Id == userId);
            return user == null ? BadRequest() : Ok(_accountService.RefreshAccessToken(tokenDto.token, user));
        }

        [HttpPost("tokens/cancel")]
        public async Task<IActionResult> CancelAccessToken()
        {
            await _tokenManager.DeactivateCurrentAsync();

            return NoContent();
        }
    }
}

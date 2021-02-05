using System.Threading.Tasks;
using just_do.Contexts;
using just_do.Models;
using just_do.Models.ActionModels;
using just_do.Models.ActionModels.Authentication;
using just_do.Models.BaseModels;
using just_do.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace just_do.Controllers
{
    public class AuthController : BaseApiController
    {
        private readonly IAccountService _accountService;
        private readonly ITokenManager _tokenManager;

        public AuthController(
            IHttpContextAccessor contextAccessor,
            ApplicationContext context,
            IAccountService accountService,
            ITokenManager tokenManager) : base(contextAccessor, context)
        {
            _accountService = accountService;
            _tokenManager = tokenManager;
        }

        [HttpPost("sign-up")]
        [AllowAnonymous]
        public async Task<IActionResult> SignUp([FromBody] RegisterModel request)
        {
            await _accountService.SignUp(request.Email, request.Password);

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

        [HttpPost("refresh-token")]
        [AllowAnonymous]
        public async Task<ActionResult<JsonWebToken>> RefreshAccessToken([FromBody] TokenDto tokenDto)
        {
            if (_contextUserId != null)
            {
                var user = await _context.Users.FirstOrDefaultAsync(a => a.Id == _contextUserId);
                return Ok(_accountService.RefreshAccessToken(tokenDto.token, user));
            }
            return NotFound();
        }

        [HttpPost("cancel-token")]
        public async Task<IActionResult> CancelAccessToken()
        {
            await _tokenManager.DeactivateCurrentAsync();

            return NoContent();
        }
    }
}

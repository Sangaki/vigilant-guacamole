using System;
using System.Linq;
using System.Threading.Tasks;
using just_do.Contexts;
using just_do.Models.ActionModels.Authentication;
using just_do.Models.BaseModels;
using Microsoft.AspNetCore.Identity;

namespace just_do.Services
{
    public interface IAccountService
    {
        Task SignUp(string username, string password);
        JsonWebToken SignIn(User user);
        JsonWebToken RefreshAccessToken(string token, User user);
    }
    public class AccountService : IAccountService
    {
        private readonly ApplicationContext _context;
        private readonly UserManager<User> _userManager;
        private readonly IJwtHandler _jwtHandler;
        private readonly IPasswordHasher<User> _passwordHasher;

        public AccountService(
            IJwtHandler jwtHandler,
            IPasswordHasher<User> passwordHasher,
            ApplicationContext context,
            UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
            _jwtHandler = jwtHandler;
            _passwordHasher = passwordHasher;
        }

        public async Task SignUp(string username, string password)
        {
            var registerResult = await _userManager.CreateAsync(new User { Email = username, UserName = username }, password);

            if (!registerResult.Succeeded)
            {
                throw new Exception("Cannot create user");
            };
        }

        public JsonWebToken SignIn(User user)
        {
            var jwt = _jwtHandler.Create(user);
            var refreshToken = _passwordHasher.HashPassword(user, Guid.NewGuid().ToString())
                .Replace("+", string.Empty)
                .Replace("=", string.Empty)
                .Replace("/", string.Empty);
            jwt.RefreshToken = refreshToken;

            var oldRefreshToken = _context.RefreshTokens.Where(r => r.Username == user.Email)
                .FirstOrDefault(t => t.Revoked == false);
            if (oldRefreshToken != null)
            {
                oldRefreshToken.Revoked = true;
            }
            _context.RefreshTokens.Add(new RefreshToken { TokenId = Guid.NewGuid().ToString(), Username = user.Email, Token = refreshToken });
            _context.SaveChanges();

            return jwt;
        }

        public JsonWebToken RefreshAccessToken(string token, User user)
        {
            var refreshToken = GetRefreshToken(token);
            if (refreshToken == null)
            {
                throw new Exception("Refresh token was not found.");
            }
            if (refreshToken.Revoked)
            {
                throw new Exception("Refresh token was revoked");
            }

            user ??= _context.Users.FirstOrDefault(u => u.Email == refreshToken.Username);
            if (user == null)
            {
                throw new Exception("User not found.");
            }

            var jwt = _jwtHandler.Create(user);
            jwt.RefreshToken = refreshToken.Token;

            return jwt;
        }

        private async Task<User> GetUser(string username)
        {
            return await _userManager.FindByEmailAsync(username);
        }

        private RefreshToken GetRefreshToken(string token)
            => _context.RefreshTokens.SingleOrDefault(x => x.Token == token);
    }
}

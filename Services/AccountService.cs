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
        void SignUp(string username, string password);
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

        public async void SignUp(string username, string password)
        {
            if (string.IsNullOrWhiteSpace(username))
            {
                throw new Exception($"Username can not be empty.");
            }
            if (string.IsNullOrWhiteSpace(password))
            {
                throw new Exception($"Password can not be empty.");
            }
            if (GetUser(username) != null)
            {
                throw new Exception($"Username '{username}' is already in use.");
            }
            await _userManager.CreateAsync(new User { Email = username, PasswordHash = password });
        }

        public JsonWebToken SignIn(User user)
        {
            var jwt = _jwtHandler.Create(user);
            var refreshToken = _passwordHasher.HashPassword(user, Guid.NewGuid().ToString())
                .Replace("+", string.Empty)
                .Replace("=", string.Empty)
                .Replace("/", string.Empty);
            jwt.RefreshToken = refreshToken;

            _context.RefreshTokens.Add(new RefreshToken { Username = user.Email, Token = refreshToken });
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

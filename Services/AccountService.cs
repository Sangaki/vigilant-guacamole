using System;
using System.Collections.Generic;
using System.Linq;
using just_do.Models;
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
        private readonly ISet<User> _users = new HashSet<User>();
        private readonly ISet<RefreshToken> _refreshTokens = new HashSet<RefreshToken>();
        private readonly IJwtHandler _jwtHandler;
        private readonly IPasswordHasher<User> _passwordHasher;

        public AccountService(IJwtHandler jwtHandler,
            IPasswordHasher<User> passwordHasher)
        {
            _jwtHandler = jwtHandler;
            _passwordHasher = passwordHasher;
        }

        public void SignUp(string username, string password)
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
            _users.Add(new User { Email = username, PasswordHash = password });
        }

        public JsonWebToken SignIn(User user)
        {
            var jwt = _jwtHandler.Create(user);
            var refreshToken = _passwordHasher.HashPassword(user, Guid.NewGuid().ToString())
                .Replace("+", string.Empty)
                .Replace("=", string.Empty)
                .Replace("/", string.Empty);
            jwt.RefreshToken = refreshToken;
            _refreshTokens.Add(new RefreshToken { Username = user.Email, Token = refreshToken });

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

        private User GetUser(string username)
            => _users.SingleOrDefault(x => string.Equals(x.Email, username, StringComparison.InvariantCultureIgnoreCase));

        private RefreshToken GetRefreshToken(string token)
            => _refreshTokens.SingleOrDefault(x => x.Token == token);
    }
}

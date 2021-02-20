using System;
using System.Net;
using System.Threading.Tasks;
using JustToDo.Interfaces;
using JustToDo.Models;
using Xamarin.Essentials;

namespace JustToDo.Managers
{
    public class AuthService: IAuthService
    {
        public void ClearTokensInStorage()
        {
            SecureStorage.Remove("accessToken");
            SecureStorage.Remove("refreshToken");
            SecureStorage.Remove("userId");
            SecureStorage.Remove("expires");
        }

        public async void SetTokensToStorage(JsonWebToken jsonWebToken)
        {
            ClearTokensInStorage();
            await SecureStorage.SetAsync("accessToken", jsonWebToken.AccessToken);
            await SecureStorage.SetAsync("refreshToken", jsonWebToken.RefreshToken);
            await SecureStorage.SetAsync("userId", jsonWebToken.userId);
            await SecureStorage.SetAsync("expires", jsonWebToken.Expires.ToString());
        }
    }
}
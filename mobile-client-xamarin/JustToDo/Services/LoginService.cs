using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using JustToDo.Models;
using Newtonsoft.Json;

namespace JustToDo.Managers
{
    public class LoginService
    {
        private readonly HttpClient _httpClient;
        private readonly AuthService _authService;
        
        public LoginService(AuthService authService, HttpClient httpClient)
        {
            _authService = authService;
            _httpClient = httpClient;
        }
        public async Task<JsonWebToken> SignIn(LoginModel loginData)
        {
            _httpClient.DefaultRequestHeaders.Authorization = null;
            var response = await _httpClient.PostAsync(new Uri("/api/auth/sign-in"), 
                new StringContent(JsonConvert.SerializeObject(loginData), Encoding.UTF8, "application/json"));
            if (response.StatusCode == HttpStatusCode.OK)
            {
                var contentString = await response.Content.ReadAsStringAsync();
                var tokens = JsonConvert.DeserializeObject<JsonWebToken>(contentString);
                if (tokens == null) throw new Exception("Invalid response data");
                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", tokens!.AccessToken);
                _authService.SetTokensToStorage(tokens);
                return tokens;
            }
            else
            {
                throw new Exception("Cannot sign in");
            }
        }

        public async void SignOut()
        {
            _authService.ClearTokensInStorage();
            await _httpClient.PostAsync(new Uri("/api/auth/cancel-token"), null);
        }
    }
}
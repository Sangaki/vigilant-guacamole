using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using JustToDo.Models;
using Newtonsoft.Json;
using Xamarin.Essentials;

namespace JustToDo.Managers
{
    public class CustomHttpClient: HttpClient
    {
        private readonly AuthService _authService;

        public CustomHttpClient(AuthService authService)
        {
            _authService = authService;
        }

        private async Task<HttpResponseMessage> RefreshTokenRequest(string refreshToken)
        {
            DefaultRequestHeaders.Authorization = null;
            var tokenDto = JsonConvert.SerializeObject(new TokenDto(refreshToken));
            var response = await PostAsync(new Uri("/api/auth/refresh-token"), 
                new StringContent(tokenDto, Encoding.UTF8, "application/json"));
            return response;
        }

        private async Task UpdateToken()
        {
            var ssRefreshToken = await SecureStorage.GetAsync("refreshToken");
            var tokensResponse = await RefreshTokenRequest(ssRefreshToken);
            var tokensResponseContent = await tokensResponse.Content.ReadAsStringAsync();
            var tokens = JsonConvert.DeserializeObject<JsonWebToken>(tokensResponseContent);
            // if (tokens == null) throw new Exception("Cannot refresh token in request handler");
            if (tokens == null)
            {
                Console.WriteLine("Cannot refresh token in request handler");
            }
            DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", tokens.AccessToken);
            _authService.SetTokensToStorage(tokens);
        }
        
        public async Task<HttpResponseMessage> HttpGetR(string route)
        {
            var response = await GetAsync(route);
            if (response.StatusCode != HttpStatusCode.Unauthorized)
            {
                return response;
            }

            await UpdateToken();

            response = await GetAsync(route);
            return response;
        }
        
        public async Task<HttpResponseMessage> HttpPostR(string route, HttpContent data)
        {
            var response = await PostAsync(route, data);
            if (response.StatusCode != HttpStatusCode.Unauthorized)
            {
                return response;
            }

            await UpdateToken();

            response = await PostAsync(route, data);
            return response;
        }
        
        public async Task<HttpResponseMessage> HttpPutR(string route, HttpContent data)
        {
            var response = await PutAsync(route, data);
            if (response.StatusCode != HttpStatusCode.Unauthorized)
            {
                return response;
            }

            await UpdateToken();

            response = await PutAsync(route, data);
            return response;
        }
        
        public async Task<HttpResponseMessage> HttpDeleteR(string route)
        {
            var response = await DeleteAsync(route);
            if (response.StatusCode != HttpStatusCode.Unauthorized)
            {
                return response;
            }

            await UpdateToken();
            
            response = await DeleteAsync(route);
            return response;
        }
    }
}
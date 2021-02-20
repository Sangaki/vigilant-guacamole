using System;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Xamarin.Essentials;

namespace JustToDo.Managers
{
    public class ServiceManager
    {
        public readonly AuthService _authService;
        public readonly CustomHttpClient _httpClient;
        public readonly LoginService _loginService;
        public readonly TaskService _taskService;
        private const string BaseApiUrl = "http://just-do-sangaki.herokuapp.com/";

        public ServiceManager()
        {
            _authService = new AuthService();
            _httpClient = new CustomHttpClient(_authService) {BaseAddress = new Uri(BaseApiUrl)};
            Func<string> getAccessToken = () => GetUserToken().Result;
            var accessToken = getAccessToken.Invoke();
            if (accessToken != null)
            {
                _httpClient.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue("Bearer", accessToken);
            }
            _httpClient.DefaultRequestHeaders
                .Accept
                .Add(new MediaTypeWithQualityHeaderValue("application/json"));
            
            _loginService = new LoginService(_authService, _httpClient);
            _taskService = new TaskService(_httpClient);
        }
        
        private static async Task<string> GetUserToken()
        {
            return await SecureStorage.GetAsync("accessToken");
        }
    }
}
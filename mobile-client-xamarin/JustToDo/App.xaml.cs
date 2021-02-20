using System;
using System.Threading.Tasks;
using JustToDo.Components;
using JustToDo.Managers;
using Xamarin.Essentials;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

[assembly: XamlCompilation(XamlCompilationOptions.Compile)]
namespace JustToDo
{
    public partial class App : Application
    {
        public static INavigation GlobalNavigation { get; private set; }
        public static ServiceManager ServiceManager { get; private set; }
        public static PagesManager PagesManager { get; private set; }
        public App()
        {
            InitializeComponent();
            
            ServiceManager = new ServiceManager();
            PagesManager = new PagesManager();
            
            MainPage = new NavigationPage(new TasksFlyoutPage());
            GlobalNavigation = MainPage.Navigation;
        }
        
        protected override void OnStart()
        {
            Func<string> getAccessToken = () => GetUserToken().Result;
            var accessToken = getAccessToken.Invoke();
            if (accessToken == null)
            {
                PagesManager.NavToLoginModal();
            }
        }

        protected override void OnSleep()
        {
            // Handle when your app sleeps
        }

        protected override void OnResume()
        {
            // Handle when your app resumes
        }
        private static async Task<string> GetUserToken()
        {
            return await SecureStorage.GetAsync("accessToken");
        }
    }
}
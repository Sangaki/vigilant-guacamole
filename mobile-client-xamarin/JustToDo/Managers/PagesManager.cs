using JustToDo.Components;
using JustToDo.ViewModels;

namespace JustToDo.Managers
{
    public class PagesManager
    {
        private readonly Login _loginPage;
        private readonly Register _registerPage;
        private readonly TasksFlyoutPage _tasksPage;
        private readonly Settings _settingsPage;

        public PagesManager()
        {
            _loginPage = new Login();
            _registerPage = new Register();
            _tasksPage = new TasksFlyoutPage();
            _settingsPage = new Settings();
        }

        public async void NavToRegisterModal()
        {
            await App.GlobalNavigation.PushModalAsync(_registerPage);
        }

        public async void NavToLoginModal()
        {
            await App.GlobalNavigation.PushModalAsync(_loginPage);
        }

        public async void NavToSettingsPage()
        {
            await App.GlobalNavigation.PushAsync(_settingsPage);
        }

        public void UpdateTasksPage()
        {
            _tasksPage.UpdateTasksPage();
        }
        
        public static async void PopToRoot()
        {
            await App.GlobalNavigation.PopModalAsync();
            await App.GlobalNavigation.PopToRootAsync();
        }

        public async void CloseLastModal()
        {
            await App.GlobalNavigation.PopModalAsync();
        }
    }
}
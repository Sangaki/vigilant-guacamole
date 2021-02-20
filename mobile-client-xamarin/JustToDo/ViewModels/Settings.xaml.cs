using System;
using JustToDo.Managers;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace JustToDo.ViewModels
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class Settings : ContentPage
    {
        public Settings()
        {
            InitializeComponent();
        }
        private void OnLogoutClicked(object sender, EventArgs e)
        {
            App.ServiceManager._loginService.SignOut();
            App.PagesManager.NavToLoginModal();
        }
    }
}
using System;
using JustToDo.Models;
using JustToDo.Managers;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace JustToDo.ViewModels
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class Login: ContentPage
    {
        protected override bool OnBackButtonPressed() => false;
        public Login()
        {
            InitializeComponent();
        }

        private async void OnSignInClicked(object sender, EventArgs e)
        {
            var loginData = new LoginModel(email.Text, password.Text);
            var loginTask = await App.ServiceManager._loginService.SignIn(loginData);
            if (loginTask == null) return;
            PagesManager.PopToRoot();
        }
        
        private void NavToRegister(object sender, EventArgs e)
        {
            App.PagesManager.NavToRegisterModal();
        }
    }
}
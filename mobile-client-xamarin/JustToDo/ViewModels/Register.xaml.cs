using System;
using JustToDo.Managers;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace JustToDo.ViewModels
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class Register : ContentPage
    {
        public Register()
        {
            InitializeComponent();
        }

        private void OnSignUpClicked(object sender, EventArgs e)
        {
            (sender as Button).Text = "Click me again!";
        }

        private async void NavToLogin(object sender, EventArgs e)
        {
            await Navigation.PopModalAsync();
        }
    }
}
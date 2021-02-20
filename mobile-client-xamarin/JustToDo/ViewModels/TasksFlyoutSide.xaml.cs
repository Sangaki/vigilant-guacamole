using System;
using JustToDo.Components;
using JustToDo.Models;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace JustToDo.ViewModels
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class TasksFlyoutSide : ContentPage
    {
        private readonly TasksFlyoutPage _tasksFlyoutPage;
        public TasksFlyoutSide(TasksFlyoutPage tasksFlyoutPage)
        {
            _tasksFlyoutPage = tasksFlyoutPage;
            
            InitializeComponent();
            
            var settingsButtonTap = new TapGestureRecognizer();
            settingsButtonTap.Tapped += (sender, args) => OnSettingsButtonClick(); 
            SettingsButton.GestureRecognizers.Add(settingsButtonTap);
            
            var signOutButtonTap = new TapGestureRecognizer();
            signOutButtonTap.Tapped += (sender, args) => OnSignOutButtonClick(); 
            SignOutButton.GestureRecognizers.Add(signOutButtonTap);
            
            var allPrioritiesButtonTap = new TapGestureRecognizer();
            allPrioritiesButtonTap.Tapped += PriorityClickerHandler;
            AllPrioritiesButton.GestureRecognizers.Add(allPrioritiesButtonTap);
            
            foreach (var priority in Enum.GetNames(typeof(TaskPriority)))
            {
                var priorityChild = new Label
                {
                    Text = priority, 
                    TextColor = Color.Black, 
                    FontAttributes = FontAttributes.Bold,
                    FontSize = 20,
                };

                PriorityStackLayout.Children.Add(priorityChild);

                var priorityButtonTap = new TapGestureRecognizer();
                priorityButtonTap.Tapped += PriorityClickerHandler;
                priorityChild.GestureRecognizers.Add(priorityButtonTap);
            }
        }

        private static void PriorityClickerHandler(object s, EventArgs args)
        {
            Console.WriteLine(s.ToString());
        }
        private void OnSignOutButtonClick()
        {
            _tasksFlyoutPage.CloseSidebar();
            App.ServiceManager._loginService.SignOut();
            App.PagesManager.NavToLoginModal();
        }
        private void OnSettingsButtonClick()
        {
            _tasksFlyoutPage.CloseSidebar();
            App.PagesManager.NavToSettingsPage();
        }
    }
}
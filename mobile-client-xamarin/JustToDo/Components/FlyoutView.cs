using JustToDo.ViewModels;
using JustToDo.Managers;
using Xamarin.Forms;

namespace JustToDo.Components
{
    public class TasksFlyoutPage : FlyoutPage
    {
        private readonly Tasks _tasks;
        public TasksFlyoutPage()
        {
            _tasks = new Tasks();
            Flyout = new TasksFlyoutSide( this);
            Detail = new NavigationPage(_tasks);
            
            NavigationPage.SetHasNavigationBar(this, false);
        }
        
        public void UpdateTasksPage()
        {
            var command = _tasks.RefreshCommand;
            command.Execute(null);
        }
        
        public void CloseSidebar()
        {
            IsPresented = false;
        }
    }
}
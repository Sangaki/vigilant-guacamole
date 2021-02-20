using System.Diagnostics;
using System.Threading.Tasks;
using System.Windows.Input;
using JustToDo.Components;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace JustToDo.ViewModels
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class Tasks : ContentPage
    {
        private bool _isRefreshing;
        public ICommand RefreshCommand { get; }

        private BindableProperty PageTitleText { get; set; }

        public string TitleText;
        public Tasks()
        {
            BindingContext = this;
            RefreshCommand = new Command(ExecuteRefreshCommand);
            
            InitializeComponent();
            PageTitleText = BindableProperty.Create("TitleText", typeof(string), typeof(Tasks), "All");
            TitleText = "QWE";
            UpdateTasks();
        }

        public bool IsRefreshing
        {
            get => _isRefreshing;
            set
            {
                _isRefreshing = value;
                OnPropertyChanged(nameof(IsRefreshing));
            }
        }
        private async void ExecuteRefreshCommand()
        {
            await UpdateTasks();
            // Stop refreshing
            IsRefreshing = false;
        }
        private async Task UpdateTasks()
        {
            var tmpTitle = PrTitleView.Text;
            TitleText = "Updating...";
            TasksStack.Children.Clear();
            var tasks = await App.ServiceManager._taskService.GetTasks();
            if (tasks == null || tasks.Count == 0) return;
            tasks.ForEach(t =>
            {
                // TasksCollection.Clear();
                // TasksCollection.Add(t);
                var taskView = new TaskView(t);
                TasksStack.Children.Add(taskView);
            });
            Debug.WriteLine(PrTitleView.Text);
            // PageTitleText.Text = tmpTitle;
        }
    }
}
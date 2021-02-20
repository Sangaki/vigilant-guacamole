using System.Globalization;
using System.Threading;
using JustToDo.Models;
using Xamarin.Forms;

namespace JustToDo.Components
{
    public class TaskView : ContentView
    {
        public TaskView(ToDoTask toDoTask)
        {
            var taskGrid = new Grid
            {
                RowDefinitions =
                {
                    new RowDefinition {Height = new GridLength(50)},
                    new RowDefinition {Height = new GridLength(50)}
                },
                ColumnDefinitions =
                {
                    new ColumnDefinition { Width = new GridLength(10) },
                    new ColumnDefinition { Width = new GridLength(40, GridUnitType.Star) },
                    new ColumnDefinition { Width = new GridLength(40, GridUnitType.Star) },
                    new ColumnDefinition { Width = new GridLength(10, GridUnitType.Star) }
                }
            };
            
            var taskColor = toDoTask.priority switch
            {
                TaskPriority.Normal => Color.FromHex("307e02"),
                TaskPriority.Neutral => Color.FromHex("c9c9c9"),
                TaskPriority.Urgently => Color.FromHex("f24a3c"),
                TaskPriority.Important => Color.FromHex("f7c920"),
                _ => Content.BackgroundColor
            };
            var priorityBoxView = new BoxView { Color = taskColor };
            taskGrid.Children.Add(priorityBoxView, 0, 1, 0,2);
            
            var taskCompletedCheckBox = new CheckBox { IsChecked = false };
            taskCompletedCheckBox.CheckedChanged += (e, args) => SetTaskCompleted(toDoTask.TaskId);
            taskGrid.Children.Add(taskCompletedCheckBox, 3, 4, 0,2);
            
            var taskLabel = new Label {Text = toDoTask.Name};
            var taskDescription = new Label {Text = toDoTask.Description};
            var taskDate = new Label {Text = toDoTask.dateTime.ToString(CultureInfo.InvariantCulture)};
            var taskPriorityText = new Label {Text = toDoTask.priority.ToString()};
            taskGrid.Children.Add(taskLabel, 1, 0);
            taskGrid.Children.Add(taskDescription, 1, 1);
            taskGrid.Children.Add(taskDate, 2, 0);
            taskGrid.Children.Add(taskPriorityText, 2,1);

            Content = taskGrid;
        }

        private static async void SetTaskCompleted(string id)
        {
            await App.ServiceManager._taskService.CompleteTask(id);
            Thread.Sleep(500);
            App.PagesManager.UpdateTasksPage();
        }
    }
}
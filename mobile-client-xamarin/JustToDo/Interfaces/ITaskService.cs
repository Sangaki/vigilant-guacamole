using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using JustToDo.Models;

namespace JustToDo.Interfaces
{
    public interface ITaskService
    {
        #nullable enable
        Task<List<ToDoTask>?> GetTasks();
        Task<ToDoTask> CreateTask(NewToDoTask toDoTask);
        Task<ToDoTask> UpdateTask(ToDoTask toDoTask);
        Task CompleteTask(string id);
        Task DeleteTask(string id);
    }
}
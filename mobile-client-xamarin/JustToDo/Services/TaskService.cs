#nullable enable
using System.Collections.Generic;
using System.Threading.Tasks;
using JustToDo.Interfaces;
using JustToDo.Models;
using Newtonsoft.Json;

namespace JustToDo.Managers
{
    public class TaskService: ITaskService
    {
        private readonly CustomHttpClient _httpClient;
        public TaskPriority CurrentPriority { get; set; }
        public TaskService(CustomHttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<List<ToDoTask>?> GetTasks()
        {
            var response = await _httpClient.HttpGetR("/api/tasks");
            if (response.IsSuccessStatusCode)
            {
                var responseContent = await response.Content.ReadAsStringAsync();
                var jsonConverted = JsonConvert.DeserializeObject<List<ToDoTask>>(responseContent);
                return jsonConverted;
            }
            else
            {
                return new List<ToDoTask>();
                // throw new Exception("Cannot get tasks list");
            }
        }

        public async Task CompleteTask(string id)
        {
            await _httpClient.HttpDeleteR($"/api/tasks/{id}");
        }

        public Task<ToDoTask> CreateTask(NewToDoTask toDoTask)
        {
            throw new System.NotImplementedException();
        }

        public Task<ToDoTask> UpdateTask(ToDoTask toDoTask)
        {
            throw new System.NotImplementedException();
        }

        public async Task DeleteTask(string id)
        {
            await _httpClient.HttpDeleteR($"/api/tasks/{id}");
        }
    }
}
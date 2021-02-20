using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using just_do.Contexts;
using just_do.Enums;
using just_do.Models.BaseModels;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace just_do.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class TasksController : BaseApiController
    {
        public TasksController(IHttpContextAccessor contextAccessor, ApplicationContext context): base (contextAccessor, context)
        {
        }

        // GET: api/Tasks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ToDoTask>>> GetTasks(TaskPriority? taskPriority)
        {
            if (taskPriority != null)
            {
                return await _context.Tasks.Where(t => t.UserId == _contextUserId && t.priority == taskPriority).ToListAsync();
            } 
            else
            {
                return await _context.Tasks.Where(t => t.UserId == _contextUserId).ToListAsync();
            }
        }

        // GET: api/Tasks/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ToDoTask>> GetToDoTask(string id)
        {
            var toDoTask = await _context.Tasks.FindAsync(id);

            if (toDoTask == null || toDoTask.UserId != _contextUserId) 
            {
                return NotFound();
            }

            return toDoTask;
        }

        // PUT: api/Tasks
        [HttpPut]
        public async Task<IActionResult> PutToDoTask(ToDoTask toDoTask)
        {
            var toDoTaskInDb = await _context.Tasks
                .AsNoTracking()
                .Where(t => t.UserId == _contextUserId)
                .FirstOrDefaultAsync(x => x.TaskId == toDoTask.TaskId);
            
            if (toDoTaskInDb == null)
            {
                return NotFound();
            }
            
            _context.Entry(toDoTask).State = EntityState.Modified;

            await _context.SaveChangesAsync();
            
            return Ok(toDoTask);
        }

        // POST: api/Tasks
        [HttpPost]
        public async Task<ActionResult<ToDoTask>> PostToDoTask(ToDoTask toDoTask)
        {
            toDoTask.UserId = _contextUserId;
            toDoTask.TaskId = Guid.NewGuid().ToString();
            _context.Tasks.Add(toDoTask);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (ToDoTaskExists(toDoTask.TaskId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Ok(toDoTask);
        }

        // DELETE: api/Tasks/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<ToDoTask>> DeleteToDoTask(string id)
        {
            var toDoTask = await _context.Tasks.FindAsync(id);
            
            if (toDoTask == null || toDoTask.UserId != _contextUserId)
            {
                return NotFound();
            }

            _context.Tasks.Remove(toDoTask);
            await _context.SaveChangesAsync();

            return toDoTask;
        }

        private bool ToDoTaskExists(string id)
        {
            return _context.Tasks.Any(e => e.TaskId == id);
        }
    }
}

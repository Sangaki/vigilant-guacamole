using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using just_do.Contexts;
using just_do.Models.BaseModels;
using Microsoft.AspNetCore.Authorization;
using just_do.Enums;

namespace just_do.Controllers
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly ApplicationContext _context;

        public TasksController(ApplicationContext context)
        {
            _context = context;
        }

        // GET: api/Tasks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ToDoTask>>> GetTasks(TaskPriority? taskPriority)
        {
            var userId = HttpContext.User.Claims.First().Value;
            if (taskPriority != null)
            {
                return await _context.Tasks.Where(t => t.UserId == userId && t.priority == taskPriority).ToListAsync();
            } 
            else
            {
                return await _context.Tasks.Where(t => t.UserId == userId).ToListAsync();
            }
        }

        // GET: api/Tasks/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ToDoTask>> GetToDoTask(string id)
        {
            var userId = HttpContext.User.Claims.First().Value;
            var toDoTask = await _context.Tasks.FindAsync(id);

            if (toDoTask == null || toDoTask.UserId != userId)
            {
                return NotFound();
            }

            return toDoTask;
        }

        // PUT: api/Tasks/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutToDoTask(string id, ToDoTask toDoTask)
        {
            var userId = HttpContext.User.Claims.First().Value;
            var toDoTaskInDb = await _context.Tasks.AsNoTracking().FirstOrDefaultAsync(x => x.TaskId == id);
            
            if (id != toDoTask.TaskId || toDoTaskInDb == null || toDoTaskInDb.UserId != userId)
            {
                return BadRequest();
            }
            
            _context.Entry(toDoTask).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ToDoTaskExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetToDoTask", new { id = toDoTask.TaskId }, toDoTask);
        }

        // POST: api/Tasks
        [HttpPost]
        public async Task<ActionResult<ToDoTask>> PostToDoTask(ToDoTask toDoTask)
        {
            var userId = HttpContext.User.Claims.First().Value;
            toDoTask.UserId = userId;
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

            return CreatedAtAction("GetToDoTask", new { id = toDoTask.TaskId }, toDoTask);
        }

        // DELETE: api/Tasks/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<ToDoTask>> DeleteToDoTask(string id)
        {
            var toDoTask = await _context.Tasks.FindAsync(id);
            var userId = HttpContext.User.Claims.First().Value;
            
            if (toDoTask == null || toDoTask.UserId != userId)
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

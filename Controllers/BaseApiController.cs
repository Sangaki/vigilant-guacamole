using System;
using System.Linq;
using just_do.Contexts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace just_do.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public abstract class BaseApiController : ControllerBase
    {
        #nullable enable
        protected string? _contextUserId;

        protected ApplicationContext _context;

        protected BaseApiController(IHttpContextAccessor contextAccessor, ApplicationContext applicationContext)
        {
            _contextUserId = contextAccessor.HttpContext?.User.Claims?.FirstOrDefault()?.Value;
            _context = applicationContext;
        }
    }
}

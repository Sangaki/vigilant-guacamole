using System.Threading.Tasks;
using JustToDo.Models;

namespace JustToDo.Interfaces
{
    public interface ILoginService
    {
        Task<JsonWebToken> SignIn(LoginModel loginData);
    }
}
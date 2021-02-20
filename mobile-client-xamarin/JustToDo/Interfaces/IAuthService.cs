using System.Net;
using System.Threading.Tasks;
using JustToDo.Models;

namespace JustToDo.Interfaces
{
    public interface IAuthService
    {
        void ClearTokensInStorage();
        void SetTokensToStorage(JsonWebToken jsonWebToken);
    }
}
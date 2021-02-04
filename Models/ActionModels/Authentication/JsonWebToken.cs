using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace just_do.Models.ActionModels.Authentication
{
    public class JsonWebToken
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        public long Expires { get; set; }
        public string userId { get; set; }
    }
}

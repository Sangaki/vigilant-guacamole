﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace just_do.Models.ActionModels.Authentication
{
    public class JwtOptions
    {
        public string SecretKey { get; set; }
        public int ExpiryMinutes { get; set; }
        public string Issuer { get; set; }
    }
}

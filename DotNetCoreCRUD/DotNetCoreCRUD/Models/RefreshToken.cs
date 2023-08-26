using System;
using System.Collections.Generic;

#nullable disable

namespace DotNetCoreCRUD.Models
{
    public partial class RefreshToken
    {
        public int TokenId { get; set; }
        public string Username { get; set; }
        public string RefreshToken1 { get; set; }
        public bool IsActive { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DotNetCoreCRUD
{
    public interface IRefreshTokenGenertor
    {
        string GenerateToken(string username);
    }
}

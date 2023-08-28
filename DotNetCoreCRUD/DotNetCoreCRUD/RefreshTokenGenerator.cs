using DotNetCoreCRUD.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace DotNetCoreCRUD
{
    public class RefreshTokenGenerator : IRefreshTokenGenertor
    {
        private readonly CRUDDBContext context;
        public RefreshTokenGenerator(CRUDDBContext dbContext)
        {
            this.context = dbContext;
        }
        public string GenerateToken(string username)
        {
            var randomNumber = new byte[32];
            using (var randomNumberGenerator = RandomNumberGenerator.Create())
            {
                randomNumberGenerator.GetBytes(randomNumber);
                string _refreshToken = Convert.ToBase64String(randomNumber);

                var token = context.RefreshTokens.FirstOrDefault(x=> x.Username== username);
                if (token != null)
                {
                    token.RefreshToken1 = _refreshToken;
                    context.SaveChanges();
                }
                else
                {
                    RefreshToken refreshToken = new RefreshToken()
                    {
                        Username = username,
                        RefreshToken1 = _refreshToken,
                        IsActive= true
                    };
                    context.RefreshTokens.Add(refreshToken);
                    context.SaveChanges();

                }
                return _refreshToken;
            }
        }
    }
}

using DotNetCoreCRUD.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace DotNetCoreCRUD.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly CRUDDBContext context;
        private readonly JWTSettings settings;
        private readonly IRefreshTokenGenertor refreshTokenGenertor;
        public UsersController(CRUDDBContext dbContext, IOptions<JWTSettings> options, IRefreshTokenGenertor tokenGenertor)
        {
            this.context = dbContext;
            settings = options.Value;
            this.refreshTokenGenertor = tokenGenertor;
        }
        
        [HttpGet]
        public async Task<IActionResult> Get() {
            var result =  await context.Users.ToListAsync();
            return Ok(result);
        }
        private TokenResponse Authenticate(string username, Claim[] claims)
        {
            TokenResponse tokenResponse = new TokenResponse();
            var tokenKey = Encoding.UTF8.GetBytes(settings.SecurityKey);
            var tokenHandler = new JwtSecurityToken(
                 claims: claims,
                 expires: DateTime.Now.AddMinutes(1),
                 signingCredentials: new SigningCredentials(new SymmetricSecurityKey(tokenKey), SecurityAlgorithms.HmacSha256)
                );
            tokenResponse.JWTToken = new JwtSecurityTokenHandler().WriteToken(tokenHandler);
            tokenResponse.RefreshToken = refreshTokenGenertor.GenerateToken(username);
            return tokenResponse;
        }

        [Route("Authenticate")]
        [HttpPost]
        public async Task<IActionResult> Authenticate([FromBody] UserCredentials user)
        {
            TokenResponse tokenResponse = new TokenResponse();
            var _user = await context.Users.FirstOrDefaultAsync(x => x.Username == user.Username && x.Password == user.Password);
            if (_user == null)
            {
                Unauthorized();
            }

            //JWT Token Generation
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenKey = Encoding.UTF8.GetBytes(settings.SecurityKey);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(
                        new Claim[]
                        {
                            new Claim(ClaimTypes.Name, _user.Username.ToString()),
                            new Claim(ClaimTypes.Role, _user.Role.ToString())
                        }
                    ),
                Expires = DateTime.Now.AddMinutes(2),
                SigningCredentials  = new SigningCredentials(new SymmetricSecurityKey(tokenKey), SecurityAlgorithms.HmacSha256)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            tokenResponse.JWTToken = tokenHandler.WriteToken(token);
            tokenResponse.RefreshToken = refreshTokenGenertor.GenerateToken(_user.Username);

            return Ok(tokenResponse);
        }

        [Route("Refresh")]
        [HttpPost]
        public async Task<IActionResult> Refresh([FromBody] TokenResponse token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            SecurityToken securityToken;
            var principle = tokenHandler.ValidateToken(token.JWTToken, new TokenValidationParameters()
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(settings.SecurityKey)),
                ValidateIssuer =  false,
                ValidateAudience = false
            }, out securityToken);
            var _token = securityToken as JwtSecurityToken;

            if (_token != null && !_token.Header.Alg.Equals(SecurityAlgorithms.HmacSha256))
            {
                return Unauthorized();
            }
            var username = principle.Identity.Name;
            var _refreshToken = await context.RefreshTokens.FirstOrDefaultAsync(x => x.Username == username && x.RefreshToken1 == token.RefreshToken);
            if (_refreshToken == null)
            {
                return Unauthorized();
            }
            TokenResponse _result = Authenticate(username, principle.Claims.ToArray());
            return Ok(_result);
        }
    }
}

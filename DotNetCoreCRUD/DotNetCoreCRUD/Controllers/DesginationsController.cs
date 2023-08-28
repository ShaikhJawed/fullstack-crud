using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DotNetCoreCRUD.Models;

namespace DotNetCoreCRUD.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DesginationsController : ControllerBase
    {
        private readonly CRUDDBContext _context;

        public DesginationsController(CRUDDBContext context)
        {
            _context = context;
        }

        // GET: api/Desginations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Desgination>>> GetDesginations()
        {
            return await _context.Desginations.ToListAsync();
        }
    }
}

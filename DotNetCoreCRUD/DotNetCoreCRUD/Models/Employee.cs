using System;
using System.Collections.Generic;

#nullable disable

namespace DotNetCoreCRUD.Models
{
    public partial class Employee
    {
        public int EmployeeId { get; set; }
        public string Code { get; set; }
        public string EmployeeName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public int? DesignationId { get; set; }
    }
}

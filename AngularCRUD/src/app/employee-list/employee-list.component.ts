import { Component } from '@angular/core';
import { EmployeeService } from '../Service/employee.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent {
  employeeList: any;
  constructor(private service: EmployeeService) {
    this.LoadEmployees();
  }

  LoadEmployees() {
    this.service.GetEmployees().subscribe(result => {
      this.employeeList = result;
    });
  }
  delete(id: any) {
    if (confirm('Do you really want to delete?')) {
      this.service.DeleteEmployeeById(id).subscribe(result => {
        this.LoadEmployees();
      });
    }
  }
}

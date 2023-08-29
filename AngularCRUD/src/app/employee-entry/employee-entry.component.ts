import { Component } from '@angular/core';
import { DesignationService } from '../Service/designation.service';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import { EmployeeService } from '../Service/employee.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-employee-entry',
  templateUrl: './employee-entry.component.html',
  styleUrls: ['./employee-entry.component.css']
})
export class EmployeeEntryComponent {
  designationList:any;
  saveResponse:any;
  message = '';
  messageClass = '';
  editData:any;
  employeeId:any;
  constructor(private designationService:DesignationService, private employeeService:EmployeeService, private route:ActivatedRoute) {
    this.LoadDesignations();  
    this.employeeId =  this.route.snapshot.paramMap.get('id');
    if(this.employeeId!= null && this.employeeId != 0)
    {
      this.LoadEmployee(this.employeeId);
    }
    
  }

  employeeForm = new FormGroup({
    employeeId:new FormControl(0),
    code:new FormControl('', Validators.required),
    employeeName:new FormControl('', Validators.required),
    email:new FormControl('', Validators.compose([Validators.required, Validators.email])),
    phone:new FormControl('', Validators.required),
    designationId:new FormControl('', Validators.required)
  }); 

  

  LoadDesignations(){
    this.designationService.GetDesignations().subscribe(result=>{
      this.designationList = result;
    });
  }
  SaveEmployee(){
    if(this.employeeForm.valid)
    {
        this.employeeService.SaveEmployees(this.employeeForm.value).subscribe(result=>{
          this.saveResponse = result;
          if(this.saveResponse && this.saveResponse.employeeId > 0)
          {
            this.message = 'Record saved successfully';
            this.messageClass = 'text-success'
          }else{
            this.message = 'Failed';
            this.messageClass = 'text-danger'
          }
          this.employeeForm.reset({employeeId:0, designationId:''})
        });
    }
    else{
      this.messageClass = 'text-danger';
      this.message = 'Please fill all required fields.'
    }
  }
  LoadEmployee(employeeId:any){
    this.employeeService.GetEmployeeById(employeeId).subscribe(result=>{
      this.editData = result;
      if(this.editData!=null)
      {
        this.employeeForm = new FormGroup({
          employeeId:new FormControl(this.editData.employeeId),
          code:new FormControl(this.editData.code),
          employeeName:new FormControl(this.editData.employeeName),
          email:new FormControl(this.editData.email),
          phone:new FormControl(this.editData.phone),
          designationId:new FormControl(this.editData.designationId)
        }); 
      }
    })
  }

  //Following getters are used for validation
  get code(){
    return this.employeeForm.get('code');
  }
  get employeeName(){
    return this.employeeForm.get('employeeName');
  }
  get email(){
    return this.employeeForm.get('email');
  }
  get phone(){
    return this.employeeForm.get('phone');
  } 
  get designationId(){
    return this.employeeForm.get('designationId');
  }
}

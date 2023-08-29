import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  url = 'https://localhost:44350/api/employees'
  constructor(private http:HttpClient) { }

  GetEmployees(){
    return this.http.get(this.url);
  }
  GetEmployeeById(id:any){
    return this.http.get(this.url + "/" +id);
  }
  SaveEmployees(inputData:any){
    if(inputData.employeeId && inputData.employeeId > 0)
    {
      return this.http.put(this.url + "/" + inputData.employeeId, inputData);
    }
    else{
      return this.http.post(this.url, inputData);
    }
  }
  DeleteEmployeeById(id:any){
    return this.http.delete(this.url + "/" +id);
  }
}

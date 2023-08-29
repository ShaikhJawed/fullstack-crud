import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class LoginService  {

  login_url = 'https://localhost:44350/Users/Authenticate'
  constructor(private http: HttpClient) { }

  ProceedLogin(inputData:any){
    return this.http.post(this.login_url, inputData);
  }

  IsLogged(){
    return localStorage.getItem('token') != null;
  }

}

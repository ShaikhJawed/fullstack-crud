import { Component } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import { LoginService } from '../Service/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
    message = '';
    loginResponse:any;
    constructor(private service: LoginService, private route:Router) {
      localStorage.clear();
      
    }
    
    loginForm = new FormGroup({
      username : new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });

    //Following getters are used for validation
    get username(){
      return this.loginForm.get('username');
    }
    get password(){
      return this.loginForm.get('password');
    }

    ProceedLogin(){
      if(this.loginForm.valid)
      {
        this.message ='Trying to login...';
        this.service.ProceedLogin(this.loginForm.value).subscribe(result=>{
        this.loginResponse = result;
        if(this.loginResponse.jwtToken)
        {
          localStorage.setItem('token', this.loginResponse.jwtToken);
          this.route.navigate(['']);
        }
      })
    }
    else{
      this.message = 'Username and password are required';
    }
    }

}

import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from '../Service/login.service';


@Injectable({
providedIn:'root'
})
export class TokenInterceptor implements HttpInterceptor {

  constructor(private inject:Injector) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
    var loginService = this.inject.get(LoginService);    
    var tokenRequest = request.clone({
      setHeaders:{
        Authorization:"Bearer " + loginService.GetToken()
      }
    });
    return next.handle(tokenRequest);
  }
}

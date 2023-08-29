import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DesignationService {
url = 'https://localhost:44350/api/Desginations'
  constructor(private http:HttpClient) { }
  GetDesignations(){
    return this.http.get(this.url);
  }
}

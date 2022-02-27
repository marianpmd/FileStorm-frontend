import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../environments/environment";
import {LoginData} from "../datamodel/LoginData";

const LOGIN_URL = environment.baseUrl+'/login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }

  onLogin(email:string,password:string){
    let params = new FormData();
    params.append("email",email);
    params.append("password",password);

    return  this.http.post<LoginData>(LOGIN_URL,params,{
      observe : 'response'
    });

  }
}

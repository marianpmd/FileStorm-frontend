import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../environments/environment";
import {LoginData} from "../datamodel/LoginData";
import {Observable} from "rxjs";

const LOGIN_URL = environment.baseUrl + '/login';
const REGISTER_URL = environment.baseUrl + '/user/register';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {
  }

  onLogin(email: string, password: string) {
    let params = new FormData();
    params.append("email", email);
    params.append("password", password);

    return this.http.post<LoginData>(LOGIN_URL, params, {
      observe: 'response'
    });
  }

  onRegister(email: string, password: string):Observable<{email:string,password:string}> {
    let loginDetails = {
      email: email,
      password: password
    }
    return this.http.post<{email:string,password:string}>(REGISTER_URL, loginDetails);
  }
}

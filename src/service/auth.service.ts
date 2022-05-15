import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../environments/environment";
import {LoginData} from "../datamodel/LoginData";
import {Observable} from "rxjs";
import {UserInfo} from "../datamodel/UserInfo";

export const LOGIN_URL = environment.baseUrl + '/login';
const REGISTER_URL = environment.baseUrl + '/user/register';
const INFO_URL = environment.baseUrl + '/user/info';
const ALL_USERS_URL = environment.baseUrl + '/user/all';
const DELETE_USER = environment.baseUrl + '/user/delete';
const ASSIGN_USER = environment.baseUrl + '/user/assign';

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

  onRegister(email: string, password: string): Observable<{ email: string, password: string }> {
    let loginDetails = {
      email: email,
      password: password
    }
    return this.http.post<{ email: string, password: string }>(REGISTER_URL, loginDetails);
  }

  getUserInfo(userEmail: string) {
    return this.http.get<UserInfo>(INFO_URL, {
      params: {
        email: userEmail
      }
    })
  }

  getAllUsers() {
    return this.http.get<UserInfo[]>(ALL_USERS_URL);
  }

  deleteUser(element: UserInfo) {
    return this.http.delete<UserInfo>(DELETE_USER, {
      params: {
        userId: element.id
      }
    })
  }

  assignToUser(userInfo: UserInfo, amount: any, description: any) {
    return this.http.post(ASSIGN_USER, {
      amount : amount,
      description : description
    },
      {
        params :{
          userId : userInfo.id
        },
        observe: "response"
      })
  }
}

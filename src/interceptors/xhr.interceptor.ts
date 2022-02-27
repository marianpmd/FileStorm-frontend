import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import * as http from "http";

@Injectable()
export class XhrInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let headers = request.headers;
    let token = localStorage.getItem("ocl-token");
    let httpHeaders = headers.append("Authorization" , "Bearer " + token );

    const xhr = request.clone({
        withCredentials: true,
        headers: httpHeaders
      }
    );
    return next.handle(xhr);
  }
}

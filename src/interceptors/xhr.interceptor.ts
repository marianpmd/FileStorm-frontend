import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class XhrInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let headers = request.headers;
    let token = localStorage.getItem("ocl-jwt");

    const xhr = request.clone({
        setHeaders : {
          Authorization : `Bearer ${token}`
        }
      }
    );
    return next.handle(xhr);
  }
}

import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {catchError, Observable, of, throwError} from 'rxjs';
import {Router} from "@angular/router";
import {LOGIN_URL} from "../service/auth.service";

@Injectable()
export class XhrInterceptor implements HttpInterceptor {

  constructor(private router:Router) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url == LOGIN_URL){
      return next.handle(request);
    }

    let headers = request.headers;
    let token = localStorage.getItem("ocl-jwt");


    const xhr = request.clone({
        setHeaders : {
          Authorization : `Bearer ${token}`
        }
      }
    );
    return next.handle(xhr)
      .pipe(catchError(err=> this.handleError(err)));
  }

  private handleError(err: HttpErrorResponse): Observable<any> {
    if (err.status === 401 || err.status === 403) {
      this.router.navigateByUrl(`/login`);
      console.log('Auth Error occured')
      return of(err.message);
    }
    return throwError(()=>err);
  }
}

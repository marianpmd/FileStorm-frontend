import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {Router} from "@angular/router";

@Injectable()
export class XhrInterceptor implements HttpInterceptor {

  constructor(private router: Router) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const xhr = request.clone({
        withCredentials: true
      }
    );
    return next.handle(xhr);
    // .pipe(catchError(err => this.handleError(err)));
  }

  private handleError(err: HttpErrorResponse): Observable<any> {
    if (err.status === 401 || err.status === 403) {
      this.router.navigateByUrl(`/login`);
      console.log('Auth Error occured')
      return of(err.message);
    }
    return throwError(() => err);
  }
}

import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Observable} from "rxjs";
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {
  constructor(private cookieService:CookieService,
              private router : Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let cookie = this.cookieService.get('ocl-jwt');

    if (!cookie){
      this.router.navigate(['login']);
      return false;
    }

    return true;
  }
}

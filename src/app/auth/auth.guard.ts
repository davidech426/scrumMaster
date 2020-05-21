import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

import { Router } from '@angular/router';

import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    private user:any;
    private userAuthenticated: any = null;

    constructor(private auth: AuthService, private router: Router) {
        /**this.auth.getUserState().subscribe(user => {
            console.log("got it");
            this.userAuthenticated = user;
        })**/
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        
        return this.auth.getUserState().pipe(
            map(data => {
                if (data) {
                    console.log("Access granted.");
                    return true;
                } else {
                    console.log("Access denied.");

                    this.router.navigateByUrl('/login');

                    return false;
                }
            })).pipe(take(1));


    }

}


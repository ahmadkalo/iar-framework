import { Injectable } from '@angular/core';
import {AuthService} from "./auth-service";
import {
    ActivatedRouteSnapshot,
    CanActivate,
    GuardResult,
    MaybeAsync,
    Router,
    RouterStateSnapshot
} from "@angular/router";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    async canActivate(): Promise<boolean> {
        await this.authService.updateLoginState();
        const state = this.authService.isLoggedIn();
        if(!state) { // navigate to login page, if user is not authenticated
            void this.router.navigate(['login']);
        }
        return state;
    }
}

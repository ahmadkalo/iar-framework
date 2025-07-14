import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {map, Observable, Observer, tap} from 'rxjs';
import {environment} from "../../environments/environment";
import {Credentials} from "../models/Credentials";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    loggedIn: boolean = false;
    loginStateChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    initialLoginCheckDone: boolean = false;

    constructor(private http: HttpClient) {
    }

    async isLoggedIn(): Promise<boolean> {
      if(!this.initialLoginCheckDone) {
        await this.updateLoginState()
        this.initialLoginCheckDone = true;
      }
      return this.loggedIn;
    }

    /**
     * update stored login-state by querying the backend
     */
    public updateLoginState(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
          this.checkLogin().subscribe({
            next: (response: HttpResponse<{ loggedIn: boolean }>) => {
                const newState: boolean = response.body?.loggedIn ?? false;
                this.setLoginState(newState);
                resolve(newState);
              }
          })
        });
    }

    /**
     * subscribe to changes of the login state
     */
    public onLoginStateChange(): EventEmitter<boolean> {
        return this.loginStateChange;
    }

    /**
     * retrieves the login state from backend
     */
    checkLogin(): Observable<HttpResponse<{ loggedIn: boolean }>> {
        return this.http.get<{ loggedIn: boolean }>(environment.apiEndpoint + '/api/login', {
            withCredentials: true,
            observe: 'response'
        });
    }

    /**
     * authenticates a user with credentials against backend
     *
     * @param credentials consisting of username and password
     */
    login(credentials: Credentials): Observable<HttpResponse<any>> {
        return this.http.post(environment.apiEndpoint + '/api/login', credentials, {
            withCredentials: true,
            observe: 'response',
            responseType: 'text'
        })
            .pipe(
                tap((response): void => {
                    if (response.status === 200) { // if request was successful
                        this.setLoginState(true);
                    }
                })
            );
    }

    /**
     *
     */
    logout(): Observable<HttpResponse<any>> {
        return this.http.delete(environment.apiEndpoint + '/api/login',
            {withCredentials: true, observe: 'response', responseType: 'text'}
        ).pipe(
            tap((response): void => {
                if (response.status === 200) {
                    this.setLoginState(false);
                }
            })
        );
    }

    /**
     * updates current login state handles propagation to listeners
     * @param state {boolean}
     * @private
     */
    private setLoginState(state: boolean) {
        this.loggedIn = state; //save new state
        this.loginStateChange.emit(state); //notify listeners
    }
}

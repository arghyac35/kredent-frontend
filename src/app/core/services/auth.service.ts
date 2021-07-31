import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { UserService } from '@core/services';
import { Observable } from 'rxjs';
import { User } from '@core/models';
import { environment } from '@env';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private router: Router, private http: HttpClient, private _userService: UserService) {}

  public get jwtToken(): string {
    return this._userService.userSubjectValue?.token;
  }

  signIn(credentials: { email: string; password: string }) {
    return this.http.post<any>(`${environment.apiurl}auth/signin`, credentials, { withCredentials: true }).pipe(
      map((user) => {
        this._userService.user = user;
        this.startRefreshTokenTimer();
        return user;
      })
    );
  }

  signUp(userForm: any): Observable<{ user: User; message: string }> {
    if (userForm.hasOwnProperty('passwordConfirm')) {
      // Remove the passwordConfirm field
      delete userForm.passwordConfirm;
    }
    return this.http.post<{ user: User; message: string }>(`${environment.apiurl}auth/signup`, userForm);
  }

  signOut() {
    this.http.post<any>(`${environment.apiurl}auth/revokeToken`, {}).subscribe();
    this.stopRefreshTokenTimer();
    this._userService.user = null;
  }

  refreshToken() {
    return this.http.post<any>(`${environment.apiurl}auth/refreshToken`, {}, { withCredentials: true }).pipe(
      map((user) => {
        this._userService.user = user;
        this.startRefreshTokenTimer();
        return user;
      })
    );
  }

  // helper methods

  private refreshTokenTimeout;

  private startRefreshTokenTimer() {
    // parse json object from base64 encoded jwt token
    const jwtToken = JSON.parse(atob(this.jwtToken.split('.')[1]));

    // set a timeout to refresh the token a minute before it expires
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - 60 * 1000;
    this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }
}

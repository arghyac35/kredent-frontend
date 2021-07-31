import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { User } from '@core/models';
import { environment } from '@env';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  /**
   * Constructor
   */
  constructor(private _httpClient: HttpClient) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  set user(value: any) {
    this.userSubject.next(value);
  }

  public get user$(): Observable<User> {
    return of(this.userSubject.value?.user);
  }

  public get userObj(): User {
    return this.userSubject.value?.user;
  }

  get userSubjectValue() {
    return this.userSubject.value;
  }

  getCurrentUser(): Observable<User> {
    return this.userSubject.pipe(
      take(1),
      switchMap((userDetailsAfterSignin: any) =>
        this._httpClient.get<{ user: User }>(environment.apiurl + 'users/me').pipe(
          map((currentUser: any) => {
            userDetailsAfterSignin.user = currentUser.user;

            this.userSubject.next(userDetailsAfterSignin);

            return currentUser.user;
          })
        )
      )
    );
  }
}

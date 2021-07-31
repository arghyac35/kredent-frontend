import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService, UserService } from '@core/services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private _authService: AuthService, private _userService: UserService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //skip interceptor who have header as skip
    if (request.headers.get('skip')) return next.handle(request);

    return next.handle(request).pipe(
      catchError((error) => {
        if ([401, 403].includes(error.status) && this._userService.userObj) {
          // auto logout if 401 or 403 response returned from api
          this._authService.signOut();

          // Reload the app
          location.reload();
        }

        let errorTxt = error.message || error.statusText;
        if (error.error && error.error.message) {
          errorTxt = error.error.message;
        }
        return throwError(errorTxt);
      })
    );
  }
}

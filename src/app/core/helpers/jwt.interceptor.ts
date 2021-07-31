import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from '@core/services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add auth header with jwt if user is logged in
    const jwtToken = this.authenticationService.jwtToken;
    if (jwtToken) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${jwtToken}` },
        withCredentials: true,
      });
    }

    return next.handle(request);
  }
}

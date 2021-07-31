import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule, Optional, SkipSelf } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { appInitializer, ErrorInterceptor, JwtInterceptor } from './helpers';
import { IconsModule } from './icons/icons.module';
import { AuthService, CustomSnackbarService, PostService, UserService } from '@core/services';
import { SocketService } from './services/socket.service';

@NgModule({
  declarations: [],
  imports: [CommonModule, IconsModule, MatSnackBarModule],
  exports: [],
  providers: [
    AuthService,
    UserService,
    PostService,
    SocketService,
    CustomSnackbarService,
    { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [AuthService] },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
})
export class CoreModule {
  /* make sure CoreModule is imported only by the AppModule and noone else */
  constructor(@Optional() @SkipSelf() presentInParent: CoreModule) {
    if (presentInParent) {
      throw new Error('CoreModule is already loaded. Import only in AppModule');
    }
  }
}

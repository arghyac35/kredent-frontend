import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { NoAuthGuard } from '@core/guards/noAuth.guard';
import { AppComponent } from './app.component';

const routes: Routes = [
  // Redirect empty path to '/example'
  { path: '', pathMatch: 'full', redirectTo: 'home' },

  // Redirect signed in user to the '/home'
  //
  // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
  // path. Below is another redirection for that path to redirect the user to the desired
  // location. This is a small convenience to keep all main routes together here on this file.
  { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'home' },

  // Auth routes for guests
  {
    path: '',
    canActivate: [NoAuthGuard],
    canActivateChild: [NoAuthGuard],
    component: AppComponent,
    children: [
      { path: 'sign-in', loadChildren: () => import('./features/sign-in/sign-in.module').then((m) => m.SignInModule) },
      { path: 'sign-up', loadChildren: () => import('./features/sign-up/sign-up.module').then((m) => m.SignUpModule) },
    ],
  },

  // Admin routes
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: AppComponent,
    children: [{ path: 'home', loadChildren: () => import('./features/post/post.module').then((m) => m.PostModule) }],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { PostComponent } from './post.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { DetailsComponent } from './details/details.component';
import { PostDetailsResolver, PostListResolver } from './post.resolver';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent } from '@features/header/header.component';

const routes: Route[] = [
  {
    path: '',
    component: PostComponent,
    resolve: {
      posts: PostListResolver,
    },
  },
  {
    path: ':id',
    component: DetailsComponent,
    resolve: {
      post: PostDetailsResolver,
    },
  },
];

@NgModule({
  declarations: [PostComponent, DetailsComponent, HeaderComponent],
  imports: [
    RouterModule.forChild(routes),

    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatToolbarModule,

    SharedModule,
  ],
})
export class PostModule {}

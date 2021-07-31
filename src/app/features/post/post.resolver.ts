import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { PostService } from '@core/services/post.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostListResolver implements Resolve<any> {
  /**
   * Constructor
   */
  constructor(private _postService: PostService) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Resolver
   *
   * @param route
   * @param state
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this._postService.getPosts(1, 25, 'createdAt', 'desc');
  }
}

@Injectable({
  providedIn: 'root',
})
export class PostDetailsResolver implements Resolve<any> {
  /**
   * Constructor
   */
  constructor(private _postService: PostService) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Resolver
   *
   * @param route
   * @param state
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this._postService.getPost(route.paramMap.get('id'));
  }
}

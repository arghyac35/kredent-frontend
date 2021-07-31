import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { User } from '@core/models';
import { environment } from '@env';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private _allPost: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private _post: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  /**
   * Constructor
   */
  constructor(private _httpClient: HttpClient) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  get posts$(): Observable<any[]> {
    return this._allPost.asObservable();
  }

  get post$(): Observable<any[]> {
    return this._post.asObservable();
  }

  createPost(data: any): Observable<any> {
    return this.posts$.pipe(
      take(1),
      switchMap((posts) =>
        this._httpClient.post<{ message: string; post: any }>(environment.apiurl + 'post/add', data).pipe(
          map((newPost) => {
            this._allPost.next([newPost.post, ...posts]);

            return newPost;
          })
        )
      )
    );
  }

  getPosts(
    pageNo: number,
    size: number,
    sortBy: string,
    sortDirection: string
  ): Observable<{ data: any[]; totalPages: number; totalItems: number }> {
    return this._httpClient
      .get<{ data: User[]; totalPages: number; totalItems: number }>(environment.apiurl + 'post/all', {
        params: {
          pageNo,
          size,
          sortBy,
          sortDirection,
        },
      })
      .pipe(
        tap((response) => {
          this._allPost.next(response.data);
        })
      );
  }

  getPost(id: string): Observable<any> {
    return this._httpClient.get(environment.apiurl + 'post/single/' + id).pipe(
      tap((response) => {
        this._post.next(response.post);
      })
    );
  }
}

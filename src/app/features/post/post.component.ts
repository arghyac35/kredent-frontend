import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { User } from '@core/models';
import { CustomSnackbarService, PostService, UserService } from '@core/services';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostComponent implements OnInit, OnDestroy {
  postDetails: string = '';
  posts: any[] = [];
  user: User;
  isLoading: boolean = false;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _postService: PostService,
    private _customSnackbarService: CustomSnackbarService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _userService: UserService
  ) {}

  ngOnInit(): void {
    this._postService.posts$.pipe(takeUntil(this._unsubscribeAll)).subscribe((posts) => {
      this.posts = posts;
    });

    this._userService.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe((user) => {
      this.user = user;
    });
  }

  post() {
    if (!this.postDetails) {
      this._customSnackbarService.open('Please enter something', 'error', 'Ok');
      return;
    }
    this.isLoading = true;
    this._postService.createPost({ details: this.postDetails }).subscribe(
      (response) => {
        this._customSnackbarService.open(response.message, 'info', 'Ok');
        this.postDetails = '';
        this.isLoading = false;
        this._changeDetectorRef.detectChanges();
      },
      (err) => {
        this.isLoading = false;
        this._customSnackbarService.open(err, 'error', 'Ok');
      }
    );
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}

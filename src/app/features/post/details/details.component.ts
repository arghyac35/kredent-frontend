import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { User } from '@core/models';
import { AuthService, CustomSnackbarService, PostService, UserService } from '@core/services';
import { SocketService } from '@core/services/socket.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Event } from '@core/models/event';

@Component({
  selector: 'app-post-details',
  templateUrl: './details.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsComponent implements OnInit {
  description = `We'll put a happy little sky in here. We touch the canvas, the canvas takes what it wants. A little happy sunlight shining through there. Let's build some happy little clouds up here. I was blessed with a very steady hand; and it comes in very handy when you're doing these little delicate things. This is the fun part.

  Isn't it great to do something you can't fail at? Little trees and bushes grow however makes them happy.
  Trees get lonely too, so we'll give him a little friend. There are no mistakes. You can fix anything that happens.`;

  comment: string = '';
  post: any;
  user: User;
  commentList: any[] = [];
  isLoading: boolean = false;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _postService: PostService,
    private _customSnackbarService: CustomSnackbarService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _userService: UserService,
    private _authService: AuthService,
    private _socketService: SocketService
  ) {}

  ngOnInit(): void {
    this._postService.post$.pipe(takeUntil(this._unsubscribeAll)).subscribe((post) => {
      this.post = post;
    });

    this._userService.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe((user) => {
      this.user = user;
    });

    this.initIoConnection();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  private initIoConnection(): void {
    this._socketService.initSocket(this._authService.jwtToken);

    this._socketService
      .onEvent(Event.CONNECT)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        console.log('connected');
        this._socketService.emit({ postID: this.post._id }, Event.FETCH_COMMENTS);
      });

    this._socketService.onEvent(Event.CLIENT_ERROR).subscribe((err) => {
      if (err.toString().includes('xhr')) {
        err = 'Cannot connect to socket';
      } else if (err.toString().includes('jwt') || err.toString().includes('signature')) {
        err = 'Cannot connect to socket, Unauthorized';
      }
      this.handleError(err);
    });

    this._socketService.onEvent(Event.DISCONNECT).subscribe(() => {
      console.log('disconnected');
    });

    this._socketService
      .onEvent(Event.FETCH_COMMENTS)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        console.log('FETCH_COMMENTS event called-->', data);
        if (data && data.postID === this.post._id) {
          if (this.handleCustomSocketErr(data)) {
            this.commentList = data.comments;
            this._changeDetectorRef.detectChanges();
          }
        }
      });

    // this._socketService.onEvent(Event.COMMENT_DELETED).pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe((msg) => {
    //     this.matSnackbar.open(msg, '', {
    //       duration: 3000,
    //       panelClass: ['mat-toolbar', 'mat-accent']
    //     });
    //   });

    this._socketService
      .onEvent(Event.COMMENT_POSTED)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((msg) => {
        this.comment = null;
        this.isLoading = false;
        console.log('Comment posted event called-->', msg);
        this._customSnackbarService.open(msg, 'info', 'Ok');
        this._changeDetectorRef.detectChanges();
      });

    // this._socketService.onEvent(Event.REPLY_POSTED).pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe((msg) => {
    //     this.replycontent.nativeElement.value = null;
    //     console.log('reply posted event called-->', msg);
    //     setTimeout(() => {
    //       this.isReplyPosted = false;
    //     }, 3000);
    //     this.isReplyDisable = false;
    //   });

    // this._socketService.onEvent(Event.REPLY_DELETED).pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe((msg) => {
    //     this.matSnackbar.open(msg, '', {
    //       duration: 3000,
    //       panelClass: ['mat-toolbar', 'mat-accent']
    //     });
    //   });
  }

  onCommentPost() {
    if (this.comment) {
      this.isLoading = true;
      this._changeDetectorRef.detectChanges();
      let data: any = {
        isDeleted: false,
        comment: this.comment,
        user: this._userService.userObj._id,
        post: this.post._id,
      };
      this._socketService.emit(data, Event.COMMENT);
    } else {
      this.handleError('Please enter a comment');
    }
  }

  private handleError(msg: string) {
    this._customSnackbarService.open(msg, 'error', 'Ok');
    this.isLoading = false;
    this._changeDetectorRef.markForCheck();
  }

  private handleCustomSocketErr(data: any): boolean {
    if (data.err) {
      this.handleError(`Error: ${data.err}`);
      // this.content.nativeElement.value = null;
      // this.isCommentPosted = false;
      // this.isDisable = false;
      return false;
    }
    return true;
  }
}

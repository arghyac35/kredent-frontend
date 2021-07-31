import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { io, Socket } from 'socket.io-client';
import { Event } from '@core/models/event';
import { environment } from '@env';
// import { DataService } from './data.service';

@Injectable()
export class SocketService {
  private socket: Socket;

  constructor(/*private dataService: DataService*/) {
    // this.dataService.currentSocketSub.subscribe((sok: Socket) => {
    //   this.socket = sok;
    // });
  }

  public initSocket(currentUserToken: string): void {
    // this.dataService.addSocketConnection(io(`${environment.apiurl.slice(0, -1)}`, {
    //   extraHeaders: {
    //     Authorization: `Bearer ${currentUserToken}`
    //   },
    //   reconnectionDelayMax: 10000,
    //   reconnectionAttempts: 5
    // }));

    this.socket = io(`${environment.apiurl.slice(0, -1)}`, {
      extraHeaders: {
        Authorization: `Bearer ${currentUserToken}`,
      },
      reconnectionDelayMax: 10000,
      reconnectionAttempts: 5,
    });
  }

  public disconnect(): void {
    this.socket?.disconnect();
  }

  public emit(data: any, event: Event): void {
    this.socket.emit(event, data);
  }

  public onEvent(event: Event): Observable<any> {
    return new Observable<Event>((observer) => {
      this.socket.on(event, (t) => observer.next(t));
    });
  }
}

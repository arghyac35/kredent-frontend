import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Socket } from 'socket.io-client';

@Injectable()
export class DataService {
  private socketSubject = new BehaviorSubject<Socket>(null);
  currentSocketSub = this.socketSubject.asObservable();

  constructor() {}

  addSocketConnection(socket: Socket) {
    this.socketSubject.next(socket);
  }
}

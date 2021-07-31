import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class CustomSnackbarService {
  constructor(private snackBar: MatSnackBar, private zone: NgZone) {}

  public open(message: string, classType: 'info' | 'error' = 'info', action = 'success', duration = 4000): void {
    this.zone.run(() => {
      this.snackBar.open(message, action, { duration, panelClass: classType === 'info' ? 'mat-toolbar' : 'mat-warn' });
    });
  }
}

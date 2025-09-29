import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InactivityService {
  private timeout: any;
  private readonly inactivityTime = 60000; // 5 minutes in milliseconds
  public inactivityDetected$ = new Subject<void>();

  constructor(private ngZone: NgZone) {}

  startMonitoring(): void {
    this.resetTimer();
    ['mousemove', 'keydown', 'click', 'scroll'].forEach((event) => {
      window.addEventListener(event, () => this.resetTimer());
    });
  }

  private resetTimer(): void {
    this.ngZone.runOutsideAngular(() => {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.ngZone.run(() => this.inactivityDetected$.next());
      }, this.inactivityTime);
    });
  }
}

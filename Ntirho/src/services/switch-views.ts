import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SwitchViews {
  private viewSubject = new BehaviorSubject<string>('hero');
  view$ = this.viewSubject.asObservable();

  switchView(view: string) {
    this.viewSubject.next(view);
  }
}

import { inject, Injectable, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../services/auth';
import { AuthSession } from '@supabase/supabase-js';
import { date } from 'zod';
import { Database } from '../../services/database';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  // Variable for loggedIn
  loggedIn = false;
  route_path = '';
  session: any;
  paths = ['/', '/reset-password', '/signup'];
  user_id: string | null = null;
  expires_at_string: string | null = null;

  constructor(
    private auth: AuthService, 
    private router: Router,
    private db: Database
  ) {
    
  }

  ngOnInit() {
    this.auth.isLoggedIn$.subscribe(status => {
      this.loggedIn = status;
    })
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // Get the route
    this.route_path = state.url;
    //console.log(`New navigation: ${this.route_path}`);

    // If path does not need security
    if(this.paths.includes(this.route_path))
      return true;

    this.auth.isLoggedIn$.subscribe(status => {
      this.loggedIn = status;
    })

    if (this.loggedIn) {
      // console.log('User logged in');
      return true;
    } else {
      //console.log('User not logged in');
      this.router.navigate(['/']);
      return false;//this.router.createUrlTree(['/']);;
    }
  }

  isSessionExpired (session: AuthSession) {
    if (session.expires_at){
      const expired_at = session.expires_at * 1000;     // Covert to milliseconds
      
      //console.log('Time left: ', this.convertMsToTime(Date.now() - expired_at));
      
      return Date.now() > expired_at;
    }

    return false;
  }

  isSessionExpiredSec (expires_at: number) {
    if (expires_at){
      const expired_at = expires_at * 1000;     // Covert to milliseconds
      
      // console.log('Time left: ', this.convertMsToTime(Date.now() - expired_at));
      
      return Date.now() > expired_at;
    }

    return false;
  }

  padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }

  convertMsToTime(ms: number) {
    if (ms < 0)
      ms = -1 * ms;

    const seconds = Math.floor(ms / 1000) % 60;
    const minutes = Math.floor(ms / (1000 * 60)) % 60;
    const hours = Math.floor(ms / (1000 * 60 * 60));

    return `${this.padTo2Digits(hours)}:${this.padTo2Digits(minutes)}:${this.padTo2Digits(seconds)}`;
  }

  validateUser() {
    /**
     * Check for the following and prevent if
     * Path is not ['/', 'reset-password', 'signup']
     * User is not logged in
     * Session has expired
     */

    // this.session = this.db.session;
    // console.log('Session in app: ', this.session);
    
    // // Get user id
    this.user_id = localStorage.getItem('user_id');

    // Check user id and session expires_at
    this.expires_at_string = localStorage.getItem('session_expires_at');

    if(this.expires_at_string){
      // Get the time difference
      if (this.user_id && !this.isSessionExpiredSec(Number(this.expires_at_string))) {
        return true;
      }
      else if (!this.user_id || this.isSessionExpiredSec(Number(this.expires_at_string))) {
        // User needs to be logged out
        this.auth.logout();

        // console.log('Your time is finsihed up. You need to authenticate.');
      }
    }

    return false;
  }
}

// export const authGuard: CanActivateFn = (route, state) => {
//   const auth = inject(AuthService);
//   const router = inject(Router);

//   const user_id = localStorage.getItem('user_id');
//   const expires_at = Number(localStorage.getItem('session_expires_at'));

//   const isValid = user_id && Date.now() < expires_at * 1000;

//   return isValid ? true : router.createUrlTree(['/']);
// };

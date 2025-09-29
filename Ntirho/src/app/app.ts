import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from "../components/header/header";
import { Hero } from "../components/hero/hero";
import { Footer } from "../components/footer/footer";
import { ToastrModule } from 'ngx-toastr';
import { SwitchViews } from '../services/switch-views';
import { BrowseJobs } from "./jobs/browse-jobs/browse-jobs";
import { ProfileForm } from "../components/profile-form/profile-form";
import { ProfilePage } from "./profile/profile-page/profile-page";
import { RegistrationPage } from "./signup/registration-page/registration-page";
import { PostJob } from "./admin/post-job/post-job";
import { Database } from '../services/database';
import { AuthService } from '../services/auth';
import { InactivityService } from '../services/inactivity';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Header,
    Footer,
    CommonModule
],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected title = 'Ntirho';

  // To change through different pages
  view = 'hero';
  session: any;
  route_path = '';
  isAuth = false;

  constructor(
    private viewService: SwitchViews, 
    private supabase: Database,
    private router: Router,
    private auth: AuthService,
    private cdr: ChangeDetectorRef,
    private inactivityService: InactivityService
  ) {}

  ngOnInit() {
    this.viewService.view$.subscribe(v => {
      this.view = v;
    });

    // Get path
    this.router.events.subscribe(event => {
      this.route_path = this.router.url;   

      // Control access to pages
      this.validateUser();
    });

    // Check for inactivity
    this.inactivityService.startMonitoring();
    this.inactivityService.inactivityDetected$.subscribe(event => {
      // Log the user out
      this.auth.logout();
      this.router.navigate(['/']);

      console.log('You have been inactive.');
    })
  }

  validateUser() {
    /**
     * Check for the following and prevent if
     * Path is not ['/', 'reset-password', 'signup']
     * User is not logged in
     * Session has expired
     */

    // If path does not need security
    const paths = ['/', 'reset-password', 'signup'];
    if(paths.includes(this.route_path))
      return true;

    this.session = this.auth.session;
    console.log('Session in app: ', this.session);

    // Get user id
    const user_id = this.auth.getUserId();
    console.log('User id: ', user_id);

    // Check user id and session expires_at
    const expires_at_string = localStorage.getItem('session_expires_at');
    if(expires_at_string){
      // Get the time difference
      if (user_id && !this.isSessionExpiredSec(Number(expires_at_string))) {
        return true;
      }
      else if (!user_id || this.isSessionExpiredSec(Number(expires_at_string))) {
        // User needs to be logged out
        this.auth.logout();
        this.router.navigate(['/']);

        console.log('Your time is finsihed up. You need to authenticate.');
      }
    }

    return false;
  }

  isSessionExpiredSec (expires_at: number) {
    if (expires_at){
      const expired_at = expires_at * 1000;     // Covert to milliseconds
      
      console.log('Time left: ', this.convertMsToTime(-1 * (Date.now() - expired_at)));
      
      return Date.now() > expired_at;
    }

    return false;
  }

  convertMsToTime(ms: number) {
    if (ms < 0)
      ms = 1 * ms;


    const seconds = Math.floor(ms / 1000) % 60;
    const minutes = Math.floor(ms / (1000 * 60)) % 60;
    const hours = Math.floor(ms / (1000 * 60 * 60));

    return `${this.padTo2Digits(hours)}:${this.padTo2Digits(minutes)}:${this.padTo2Digits(seconds)}`;
  }

  padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }
}

// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class Auth {
  
// }
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
//import { AngularFireAuth } from '@angular/fire/combat/auth'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userId!: string;
  private _isAuthenticated = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isAuthenticated.asObservable();

  constructor(private router: Router, private db: Database) {
    if (typeof window !== 'undefined' && localStorage) {
      const loggedIn = localStorage.getItem('isAuthenticated') === 'true';
      this._isAuthenticated.next(loggedIn);
    }
  }

  isAuthenticated(): boolean {
    return this._isAuthenticated.value;
  }

  login(): void {
    localStorage.setItem('isAuthenticated', 'true');
    this._isAuthenticated.next(true);
  }

  async loginUser(formData: { email: string; password?: string }) {
    try {
      if (formData.password) {
        // Email/password login
        const { data, error} = await this.db.signInWithEmailPassword(formData.email, formData.password);
        return { data, error };        
      } else {
        throw 'No password received.';
      }
    } catch (error: any) {
      console.error('Error while logging in user.', error);
      return { success: false, user_id: -1 };
    }
  }

  logout(): void {
    localStorage.removeItem('isAuthenticated');
    this._isAuthenticated.next(false);
    
    // Need to remove the user_id
    this.removeUserID();
  }

  /**
   * Functions to handle the userID
   * Use of localStorage
   */

  setUserId(id: string) {
    this.userId = id;

    localStorage.setItem("user_id", id);
  }

  getUserId() {
    //return this.userId;

    return localStorage.getItem("user_id");
  }

  removeUserID() {
    localStorage.removeItem("user_id");
  }
}


// Confirm Password
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Database } from './database';

// export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
//   const password = control.get('password')?.value;
//   const confirmPassword = control.get('confirmPassword')?.value;

//   return password === confirmPassword ? null : { passwordMismatch: true };
// }
export function passwordsMatchValidator(form: AbstractControl): ValidationErrors | null {
  const password = form.get('password')?.value;
  const confirm = form.get('confirmPassword')?.value;
  return password && confirm && password !== confirm ? { mismatch: true } : null;
}

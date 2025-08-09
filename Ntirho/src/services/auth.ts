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
  private _isAuthenticated = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isAuthenticated.asObservable();

  constructor(private router: Router, /* private afAuth: AngularFireAuth */) {
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

  async loginUser(formData: { email: string; password?: string }): Promise<{ success: boolean; message?: string }> {
    try {
      if (formData.password) {
        // Email/password login
        //await this.afAuth.signInWithEmailAndPassword(formData.email, formData.password);
      } else {
        // Magic link or passwordless login (if supported)
        // await this.afAuth.sendSignInLinkToEmail(formData.email, {
        //   url: 'http://localhost:4200/login',
        //   handleCodeInApp: true
        // });
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message || 'Login failed' };
    }
  }

  logout(): void {
    localStorage.removeItem('isAuthenticated');
    this._isAuthenticated.next(false);
    this.router.navigate(['/login']);
  }
}

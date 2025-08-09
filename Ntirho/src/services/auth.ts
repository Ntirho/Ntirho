// src/services/auth.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { supabase } from '../supabase/supabaseClient';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _isAuthenticated = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isAuthenticated.asObservable();
  private isBrowser: boolean;

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      const loggedIn = localStorage.getItem('isAuthenticated') === 'true';
      this._isAuthenticated.next(loggedIn);
    } else {
      // On server, set to false or handle differently if needed
      this._isAuthenticated.next(false);
    }
  }

  isAuthenticated(): boolean {
    return this._isAuthenticated.value;
  }

  login(): void {
    if (this.isBrowser) {
      localStorage.setItem('isAuthenticated', 'true');
    }
    this._isAuthenticated.next(true);
  }

async signUp(email: string, password: string): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await supabase.auth.signUp({ email, password });
    console.log('Supabase signUp response:', response);

    if (response.error) {
      return { success: false, message: response.error.message };
    }

    // Extra check if user or session exists
    if (response.data?.user || response.data?.session) {
      return { success: true };
    } else {
      
      return { success: true };
    }
  } catch (error: any) {
    return { success: false, message: error.message || 'Sign up failed' };
  }
}


async signInWithEmailPassword(email: string, password: string): Promise<{ success: boolean; message?: string }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, message: error.message };
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message || 'Sign in failed' };
  }
}




  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('isAuthenticated');
    }
    this._isAuthenticated.next(false);
    this.router.navigate(['/login']);
  }
}

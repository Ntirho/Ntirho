import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Language, LanguageService } from '../../services/language';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class Header implements OnInit {
  translations: any = {};
  isAuthenticated = false;
  pathname = '';
  langMenuOpen = false;
  userMenuOpen = false;

  constructor(
    private languageService: LanguageService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.translations = this.languageService.translations;
    // this.isAuthenticated = this.authService.isAuthenticated();
    //this.pathname = this.router.url;

    // Subscribe the value of isAuthenticated
    this.authService.isLoggedIn$.subscribe(status => {
      this.isAuthenticated = status;
      this.cdr.detectChanges();
    });

    // Subscribe to the router
    this.router.events.subscribe(status => {
      this.pathname = this.router.url;
    })
  }

  setLanguage(lang: Language) {
    this.languageService.setLanguage(lang);
    this.translations = this.languageService.translations;
    this.langMenuOpen = false;

    // Notify the UI
    this.cdr.detectChanges();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
    this.cdr.detectChanges();
  }

  toggleLangMenu() {
    this.langMenuOpen = !this.langMenuOpen;
  }

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }
}


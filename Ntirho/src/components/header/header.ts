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
  currentLang: Language = 'en';
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
    // Set the language
    this.currentLang = this.languageService.getLanguage();
    this.translations = translations[this.currentLang];
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
    this.currentLang = lang;
    this.translations = translations[this.currentLang];
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

const translations = {
  en: {
    toggleLanguage: "Toggle language",
    logo: "Ntirho",
    languageOptionEnglish: "English",
    languageOptionSepedi: "Sepedi",
    myAccount: "My Account",
    profile: "Profile",
    myMatches: "My Matches",
    findAJob: "Find a Job",
    logOut: "Log Out",
    logIn: "Log In"
  },
  nso: {
    toggleLanguage: "Fetola polelo",
    logo: "Ntirho",
    languageOptionEnglish: "Sekgowa",
    languageOptionSepedi: "Sepedi",
    myAccount: "Akhaonto ya ka",
    profile: "Purofaele",
    myMatches: "Masepelo a ka",
    findAJob: "Hwetša Mošomo",
    logOut: "Tšwa",
    logIn: "Kena"
  },
  ts: {
    toggleLanguage: "Cinca ririmi",
    logo: "Ntirho",
    languageOptionEnglish: "Xinghezi",
    languageOptionSepedi: "Sepedi",
    myAccount: "Akhawunti ya mina",
    profile: "Profayela",
    myMatches: "Swikombiso swa mina",
    findAJob: "Kuma ntirho",
    logOut: "Huma",
    logIn: "Nghena"
  }
};
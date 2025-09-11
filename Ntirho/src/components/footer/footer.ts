import { Component, OnInit } from '@angular/core';
import { Language, LanguageService } from '../../services/language';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {
  translations: any = {};
  currentLang: Language = 'en';
  currentYear = new Date().getFullYear();
  pathName = '';

  constructor(
    private languageService: LanguageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Set the language
    this.currentLang = this.languageService.getLanguage();
    this.languageService.language$.subscribe(x => {
      this.currentLang = x;
      this.translations = translations[this.currentLang];
    });

    // Subscribe to router
    this.router.events.subscribe(x => {
      this.pathName = this.router.url;
    });
  }
}

const translations = {
  en: {
    logo: "Ntirho",
    footerContact: "Contact",
    footerPrivacy: "Privacy",
    footerTraining: "Training",
    footerPostJob: "Post a Job",
    footerRights: "All rights reserved."
  },
  nso: {
    logo: "Ntirho",
    footerContact: "Kgokagano",
    footerPrivacy: "Boinotši",
    footerTraining: "Thuto",
    footerPostJob: "Romela Mošomo",
    footerRights: "Ditokelo ka moka di bolokilwe."
  },
  ts: {
    logo: "Ntirho",
    footerContact: "Vuxokoxoko",
    footerPrivacy: "Vuximamisi",
    footerTraining: "Vutivi",
    footerPostJob: "Tshumela ntirho",
    footerRights: "Swir rights hinkwaswo swi sirheleriwile."
  }
};
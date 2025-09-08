import { Component, OnInit } from '@angular/core';
import { Language, LanguageService } from '../../services/language';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [
    RouterLink
  ],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {
  translations: any = {};
  currentLang: Language = 'en';
  currentYear = new Date().getFullYear();

  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
    // Set the language
    this.currentLang = this.languageService.getLanguage();
    this.translations = translations[this.currentLang];
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
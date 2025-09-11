import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Language, LanguageService } from '../../services/language';
import { LoginForm } from "../login-form/login-form";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  imports: [
    LoginForm, 
    RouterLink
  ],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class Hero implements OnInit {
  translations: any = {};
  currentLang: Language = 'en';
  
  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
    // Set the language
    this.currentLang = this.languageService.getLanguage();
    this.languageService.language$.subscribe(x => {
      this.currentLang = x;
      this.translations = translations[this.currentLang];
    });
  }
}

const translations = {
  en: {
    heroTitle: "Empowering Youth Through Opportunity",
    thaboStoryTitle: "Thabo's Journey",
    thaboStory: "Thabo found his first internship through our platform. Today, he's leading a team of developers at a top tech company.",
    signUp: "Sign Up",
    or: "or"
  },
  nso: {
    heroTitle: "Go Matlafatša Bafsa ka Menyetla",
    thaboStoryTitle: "Leeto la Thabo",
    thaboStory: "Thabo o hweditše internship ya gagwe ya mathomo ka sethala sa rena. Lehono, o etelela pele sehlopha sa baenjineri khamphaning ye kgolo ya theknolotši.",
    signUp: "Ingwadiša",
    or: "goba"
  },
  ts: {
    heroTitle: "Ku nyika Vantshwa Matimba hi Ntirho",
    thaboStoryTitle: "Rivilo ra Thabo",
    thaboStory: "Thabo u kumile internship ya yena yo sungula hi ndlela ya platform ya hina. Namuntlha, u rhangela ntlawa wa vanjhiniya eka khampani ya thekinoloji.",
    signUp: "Tsarisa",
    or: "kumbe"
  }
};

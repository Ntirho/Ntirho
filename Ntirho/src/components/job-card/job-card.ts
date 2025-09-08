import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Language, LanguageService } from '../../services/language';
import { Job } from '../../interfaces';
import { RouterLink } from '@angular/router';
import { Modal } from "../modal/modal";

@Component({
  selector: 'app-job-card',
  imports: [
    CommonModule,
    Modal
],
  templateUrl: './job-card.html',
  styleUrl: './job-card.css'
})
export class JobCard {
  @Input() job!: Job;
  translations: any = {};
  currentLang: Language = 'en';

  constructor(
    //private toast: ToastService,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    // Set the language
    this.currentLang = this.languageService.getLanguage();
    this.translations = translations[this.currentLang];
  }

  // Viewing the job details
  isOpenModal = false;

  openModal(){
    this.isOpenModal = true;
  }
  closeModal(){
    this.isOpenModal = false;
  }

  handleApply() {
    // this.toast.show(
    //   this.translations.applicationSentTitle,
    //   `${this.translations.applicationSentDesc} ${this.job.title}`,
    //   'success'
    // );
  }
}

const translations = {
  en: {
    viewDetails: "View Details",
    companyLabel: "Company",
    locationLabel: "Location"
  },
  nso: {
    viewDetails: "Bona dintlha",
    companyLabel: "Kgwebo",
    locationLabel: "Lefelo"
  },
  ts: {
    viewDetails: "Vona Vuxokoxoko",
    companyLabel: "Kampani",
    locationLabel: "Ndhawu"
  }
};
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Job } from '../../interfaces';
import { Language, LanguageService } from '../../services/language';

@Component({
  selector: 'app-modal',
  imports: [
    CommonModule
  ],
  templateUrl: './modal.html',
  styleUrl: './modal.css'
})
export class Modal {
  @Input() openModal = false;
  @Input() job!: Job;
  @Output() close = new EventEmitter<void>();

  translations : any = {};
  currentLang: Language = 'en';

  constructor(private languageService: LanguageService){
    this.currentLang = languageService.getLanguage(); 
    this.translations = translations[this.currentLang];// languageService.translations;
  }

  onClose(){
    this.close.emit();
  }

  // Function for application
  handleApply() {

  }
}

const translations = {
  en: {
    descriptionLabel: "Job Description",
    skillsLabel: "Required Skills",
    close: "Close",
    applyNow: "Apply Now"
  },
  nso: {
    descriptionLabel: "Tlhaloso ya Mošomo",
    skillsLabel: "Makhono a Hlokagalago",
    close: "Tswalela",
    applyNow: "Romela Kgopelo"
  },
  ts: {
    descriptionLabel: "Nhlamuselo ya ntirho",
    skillsLabel: "Vutsonga byo laveka",
    close: "Pfala",
    applyNow: "Tumela xikombelo"
  }
};
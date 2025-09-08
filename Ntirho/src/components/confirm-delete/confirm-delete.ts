import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Education, Certificate, Experience } from '../../interfaces';
import { Language, LanguageService } from '../../services/language';
import { CommonModule } from '@angular/common';
import { Database } from '../../services/database';

@Component({
  selector: 'app-confirm-delete',
  imports: [
    CommonModule
  ],
  templateUrl: './confirm-delete.html',
  styleUrl: './confirm-delete.css'
})
export class ConfirmDelete implements OnInit{
  @Input() openModal = false;
  @Input() education: Education | null = null;
  @Input() certificate: Certificate | null = null;
  @Input() experience: Experience | null = null;
  @Output() close = new EventEmitter<void>();
  
  translations : any = {};
  currentLang: Language = 'en';
  
  deleteLabel = "Delete";
  message: string | null = null;
  
  constructor(
    private languageService: LanguageService, 
    private db: Database){
    this.translations = translations;
  }

  ngOnInit(): void {
  this.currentLang = this.languageService.getLanguage();
  const t = translations[this.currentLang];

  if (this.education) {
    this.deleteLabel = t.deleteEducation;
    this.message = this.education.qualification ?? '';
  } else if (this.experience) {
    this.deleteLabel = t.deleteExperience;
    this.message = this.experience.title ?? '';
  } else if (this.certificate) {
    this.deleteLabel = t.deleteCertificate;
    this.message = this.certificate.title ?? '';
  } else {
    this.deleteLabel = t.delete;
    this.message = '';
  }
}

  onClose(){
    // Nullify all the variables
    this.experience = null;
    this.education = null;
    this.certificate = null;

    this.close.emit();
  }

  async onDelete () {
      if (this.education){
        await this.db.deleteEducation(this.education.qualification_id);

        // Alert the user
        alert('Your qualification was successfully deleted.')
      }
      else if (this.experience){
        await this.db.deleteExperience(this.experience.experience_id);

        // Alert the user
        alert('Your experience was successfully deleted.')
      }
      else if (this.certificate){
        await this.db.deleteCertificate(this.certificate.certificate_id);

        // Alert the user
        alert('Your certificate was successfully deleted.')
      }
      else
        console.log('Nothing to delete');

      // Close the modal
      this.onClose();
  }
}

const translations = {
  en: {
    delete: "Delete",
    deleteEducation: "Delete: Education",
    deleteExperience: "Delete: Experience",
    deleteCertificate: "Delete: Certificate",
    confirmDelete: "You are about to delete: {{item}}. Do you still wish to proceed?",
    cancel: "Cancel"
  },
  nso: {
    delete: "Phumula",
    deleteEducation: "Phumula: Thuto",
    deleteExperience: "Phumula: Maitemogelo",
    deleteCertificate: "Phumula: Setifikeiti",
    confirmDelete: "O tlo phumula: {{item}}. O nyaka go tšwela pele?",
    cancel: "Tlogela"
  },
  ts: {
    delete: "Sula",
    deleteEducation: "Sula: Dyondzo",
    deleteExperience: "Sula: Ndzavisiso",
    deleteCertificate: "Sula: Satifikheti",
    confirmDelete: "U ta sula: {{item}}. Xana u lava ku ya emahlweni?",
    cancel: "Tshika"
  }
};
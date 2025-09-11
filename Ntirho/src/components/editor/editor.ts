import { Component, Input, Output, EventEmitter } from '@angular/core';
import { OnInit } from '@angular/core';
import { Experience, Job, Certificate, Education, AppUser } from '../../interfaces';
import { Language, LanguageService } from '../../services/language';
import { CommonModule } from '@angular/common';
import { EndSensitivity } from '@google/genai';
import { CertificateForm } from "../certification-form/certification-form";
import { ExperienceForm } from "../experience-form/experience-form";
import { EducationForm } from "../education-form/education-form";
import { RegistrationForm } from "../registration-form/registration-form";

@Component({
  selector: 'app-editor',
  imports: [
    CommonModule,
    CertificateForm,
    ExperienceForm,
    EducationForm,
    RegistrationForm
],
  templateUrl: './editor.html',
  styleUrl: './editor.css'
})
export class Editor implements OnInit{
  @Input() openModal = false;
  @Input() education: Education | null = null;
  @Input() certificate: Certificate | null = null;
  @Input() experience: Experience | null = null;
  @Input() personalDetails: AppUser | null = null;
  @Output() close = new EventEmitter<void>();

  translations : any = {};
  currentLang: Language = 'en';

  editorLabel = "Editor";

  constructor(private languageService: LanguageService){
    this.translations = translations;
  }

  ngOnInit(): void {
  this.editorLabel = this.getEditorLabel();

  // Update language
  this.languageService.language$.subscribe(x => {
    this.currentLang = x;
  })
}

getEditorLabel(): string {
  const t = translations[this.currentLang];

  if (this.personalDetails) return t.editorPersonalDetails;
  if (this.education) return t.editorEducation;
  if (this.experience) return t.editorExperience;
  if (this.certificate) return t.editorCertificate;
  return t.editor;
}


  onClose(){
    // Nullify all the variables
    this.experience = null;
    this.personalDetails = null;
    this.education = null;
    this.certificate = null;

    this.close.emit();
  }

  // Function for application
  handleApply() {

  }
}

const translations = {
  en: {
    editor: "Editor",
    editorPersonalDetails: "Editor: Personal Details",
    editorEducation: "Editor: Education",
    editorExperience: "Editor: Experience",
    editorCertificate: "Editor: Certificate"
  },
  nso: {
    editor: "Mohlaodi",
    editorPersonalDetails: "Mohlaodi: Tshedimosetso ya Botho",
    editorEducation: "Mohlaodi: Thuto",
    editorExperience: "Mohlaodi: Maitemogelo",
    editorCertificate: "Mohlaodi: Setifikeiti"
  },
  ts: {
    editor: "Muhleri",
    editorPersonalDetails: "Muhleri: Vuxokoxoko bya Munhu",
    editorEducation: "Muhleri: Dyondzo",
    editorExperience: "Muhleri: Ndzavisiso",
    editorCertificate: "Muhleri: Satifikheti"
  }
};
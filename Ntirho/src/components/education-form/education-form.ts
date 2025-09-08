import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Database } from '../../services/database';
import { AuthService } from '../../services/auth';
import { Education } from '../../interfaces';
import { Language, LanguageService } from '../../services/language';


@Component({
  selector: 'app-education-form',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './education-form.html',
  styleUrl: './education-form.css'
})
export class EducationForm implements OnInit {
  form!: FormGroup;
  @Input() userId: string | null = "";

  // For the editor
  @Input() education: Education | null = null;
  @Output() closeEditor = false;
  id = 0;
  isEdit = false;

  // Language
  currentLang: Language = 'en';
  translations: any = {};

  qualifications = [
    'Matric',
    'Diploma',
    'Degree',
    'Honours',
    'Masters',
    'PhD'
  ];

  constructor(private fb: FormBuilder, 
    private db: Database,
    private auth: AuthService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    // Set the language
    this.currentLang = this.languageService.getLanguage();
    this.translations = translations[this.currentLang];

    // Get user_id
    const user_id = this.auth.getUserId();    
    console.log('The form is valid. User id: ', user_id);

    // Editor 
    if (this.education){
      this.isEdit = true;

      // Set the id
      this.id = this.education.qualification_id
    }

    this.form = this.fb.group({
      institution: [this.education?.institution, Validators.required],
      qualification: [this.education?.qualification, Validators.required],
      start_date: [this.education?.start_date, Validators.required],
      completion_date: [this.education?.completion_date],
      average: [this.education?.average],
      user_id: [user_id]
    });
  }

  isLoading = false;
  async onSubmit() {
    this.form.markAllAsTouched();

    if (this.form.invalid){     
      console.log('The form is invalid.');
      return;
    }

    this.isLoading = true;
    
    try {
      const results = !this.isEdit ?
        await this.db.insertEducation(this.form.value) :
        await this.db.updateEducation(this.form.value, this.id);
      if ( results.error ) {
        throw results.error;
      }

      // Alert the user
      if (!this.isEdit)
        alert('Your qualification has been successfully inserted.');
      else
        alert('Your qualification has been successfully updated.');
      
      // Clear form
      this.form.reset();

      // Switch off the loader
      this.isLoading = false;

      // Update popup
      this.closeEditor = true;
    } catch (error) {
      console.error('Error while posting a qualification.', error);
      this.isLoading = false;
    } finally {
      this.isLoading = false;
    }
  }
}

const translations = {
  en: {
    institutionLabel: "School or Institution",
    institutionPlaceholder: "e.g. Lancea Vale Secondary School",
    qualificationLabel: "Qualification or Study Programme",
    qualificationSelect: "Select",
    startDateLabel: "Start Date",
    completionDateLabel: "Completion Date",
    academicAverageLabel: "Academic Average",
    saveEducation: "Save Education",
    saving: "Saving...",
    errors: {
      required: "Required.",
      invalidInstitution: "Please enter a valid institution.",
      invalidQualification: "Please select a qualification.",
      invalidDate: "Please enter a valid date.",
      invalidAverage: "Please enter a valid academic average."
    }
  },
  nso: {
    institutionLabel: "Sekolo goba Mokgatlo",
    institutionPlaceholder: "mohl. Lancea Vale Secondary School",
    qualificationLabel: "Thuto goba Lenaneo la Thuto",
    qualificationSelect: "Kgetha",
    startDateLabel: "Letšatši la go Thoma",
    completionDateLabel: "Letšatši la go Fela",
    academicAverageLabel: "Karolelano ya Thuto",
    saveEducation: "Boloka Thuto",
    saving: "E a bolokega...",
    errors: {
      required: "Ya hlokega.",
      invalidInstitution: "Tsenya leina la sekolo le le nepagetšego.",
      invalidQualification: "Kgetha thuto ye e nepagetšego.",
      invalidDate: "Tsenya letšatši le le nepagetšego.",
      invalidAverage: "Tsenya karolelano ya thuto ye e nepagetšego."
    }
  },
  ts: {
    institutionLabel: "Xikolo kumbe Nhlangano",
    institutionPlaceholder: "xik. Lancea Vale Secondary School",
    qualificationLabel: "Tidyondzo kumbe Ntirho wa dyondzo",
    qualificationSelect: "Hlawula",
    startDateLabel: "Siku ro sungula",
    completionDateLabel: "Siku ro hetelela",
    academicAverageLabel: "Avhareji ya Tidyondzo",
    saveEducation: "Hlayisa Dyondzo",
    saving: "Ku hlayisiwa...",
    errors: {
      required: "Ya laveka.",
      invalidInstitution: "Nghenisa xikolo lexi lulameke.",
      invalidQualification: "Hlawula dyondzo leyi lulameke.",
      invalidDate: "Nghenisa siku leri lulameke.",
      invalidAverage: "Nghenisa avhareji ya dyondzo leyi lulameke."
    }
  }
};
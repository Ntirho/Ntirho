import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { Database } from '../../services/database';
import { AuthService } from '../../services/auth';
import { Experience } from '../../interfaces';
import { Language, LanguageService } from '../../services/language';

@Component({
  selector: 'app-experience-form',
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './experience-form.html',
  styleUrl: './experience-form.css'
})
export class ExperienceForm implements OnInit {
  form!: FormGroup;
  @Input() userId: string | null = "";

  // Editor
  @Input() experience: Experience | null = null;
  @Output() closeEditor = false;
  isEdit = false;
  id = 0;

  // Translation
  translations: any = {};
  currentLang: Language = 'en';

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

    // Editor
    if (this.experience){
      this.isEdit = true;

      // Set the id
      this.id = this.experience.experience_id;
    }

    this.form = this.fb.group({
      title: [this.experience?.title, Validators.required],
      organization: [this.experience?.organization, Validators.required],
      start_date: [this.experience?.start_date, Validators.required],
      end_date: [this.experience?.end_date],
      description: [this.experience?.description],
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
    console.log('Experience: ', this.form.value)
    
    try {
      const results = !this.isEdit ? 
        await this.db.insertExperience(this.form.value) : 
        await this.db.updateExperience(this.form.value, this.id);
      if ( results.error ) {
        throw results.error;
      }

      // Alert the user
      if (!this.isEdit)
        alert('Your experience has been successfully inserted.');
      else
        alert('Your experience has been successfully updated.');
      
      // Clear form
      this.form.reset();

      // Update the UI
      this.isLoading = false;

      // Update popup
      this.closeEditor = true;
      
      // Clear form
      this.form.reset();
    } catch (error) {
      console.error('Error while posting a experience.', error);
      this.isLoading = false;
    } finally {
      this.isLoading = false;
    }
  }
}

const translations = {
  en: {
    organizationLabel: "Organization",
    jobTitleLabel: "Job Title",
    jobTitlePlaceholder: "e.g. Junior Software Engineer",
    descriptionLabel: "Description",
    startDateLabel: "Start Date",
    endDateLabel: "End Date",
    requiredField: "Required.",
    invalidDescription: "Please enter a valid description.",
    saveExperience: "Save Experience",
    saving: "Saving...",
    errors: {
      required: "Required.",
      invalidDescription: "Please enter a valid description.",
      minLength: "Too short.",
      maxLength: "Too long.",
      pattern: "Invalid format.",
      dateInvalid: "Please enter a valid date."
    }

  },
  nso: {
    organizationLabel: "Mokgatlo",
    jobTitleLabel: "Tirelo",
    jobTitlePlaceholder: "mohl. Moenjineri wa Software wa Bafsa",
    descriptionLabel: "Tlhaloso",
    startDateLabel: "Letšatši la go Thoma",
    endDateLabel: "Letšatši la go Fela",
    requiredField: "Ya hlokega.",
    invalidDescription: "Hle tsenya tlhaloso ye e nepagetšego.",
    saveExperience: "Boloka Phihlelo",
    saving: "E a bolokega...",
    errors: {
      required: "Ya hlokega.",
      invalidDescription: "Hle tsenya tlhaloso ye e nepagetšego.",
      minLength: "Kgopolo e khutšo.",
      maxLength: "Kgopolo e telele kudu.",
      pattern: "Sebopego se sa nepagala.",
      dateInvalid: "Hle tsenya letšatši le le nepagetšego."
    }

  },
  ts: {
    organizationLabel: "Nhlangano",
    jobTitleLabel: "Xivumbeko xa ntirho",
    jobTitlePlaceholder: "xik. Injiniya ya Software ya le henhla",
    descriptionLabel: "Nhlamuselo",
    startDateLabel: "Siku ro sungula",
    endDateLabel: "Siku ro hetelela",
    requiredField: "Ya laveka.",
    invalidDescription: "Hi kombela u nghenisa nhlamuselo leyi fambelanaka.",
    saveExperience: "Hlayisa Ntirho",
    saving: "Ku hlayisiwa...",
    errors: {
      required: "Ya laveka.",
      invalidDescription: "Hi kombela u nghenisa nhlamuselo leyi fambelanaka.",
      minLength: "Yi komile ngopfu.",
      maxLength: "Yi leha ngopfu.",
      pattern: "Fomati a yi lulamanga.",
      dateInvalid: "Hi kombela u nghenisa siku leri lulameke."
    }
  }
};
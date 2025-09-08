import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Language, LanguageService } from '../../../services/language';
import { RegistrationForm } from "../../../components/registration-form/registration-form";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordsMatchValidator } from '../../../services/auth';
import { Database } from '../../../services/database';
import { error } from 'console';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration-page',
  imports: [
    RegistrationForm,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './registration-page.html',
  styleUrl: './registration-page.css'
})
export class RegistrationPage implements OnInit {
  translations: any = {};
  currentLang: Language = 'en';
  form!: FormGroup;
  continue = false;

  constructor (
    private languageService: LanguageService, 
    private fb: FormBuilder, 
    private db: Database,
    private cdr: ChangeDetectorRef,
    private router: Router
    ) {

    this.form = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: passwordsMatchValidator    // For confirming the passwords
    })
  }

  passwordConfirmation(): boolean {
    if (this.form.invalid && this.form.get('email')?.valid && this.form.get('password')?.valid)
      return true;

    return false;
  }

  ngOnInit(): void {
    // Set the language
    this.currentLang = this.languageService.getLanguage();
    this.translations = translations[this.currentLang];
  }

  // Submission function
  async onSignup() {
    if(this.form.invalid) {
      console.log('Email and password form is invalid.');

      // Make all the form inputs touched
      this.form.markAllAsTouched();

      return;
    }

    // Have to check if the user exists
    const email = this.form.get('email')?.value;
    const emailExists = await this.db.checkUser(email);

    if (emailExists) {
      alert('The email provided is already registered');
      
      //redirect them to the home page
      this.router.navigate(['/'])

      return;
    }

    // Continue registering the user
    const password = this.form.get('password')?.value;
    const result = await this.db.signUpWithEmailPassword(email, password);

    if(result.error){
      console.error('Error while trying to register user.');
      return;
    }

    this.continue = true;
    this.cdr.detectChanges();  
  }

}

export const translations = {
  en: {
    createAccountTitle: "Create Account"
  },
  nso: {
    createAccountTitle: "Bopa Akhaonto"
  },
  ts: {
    createAccountTitle: "Tumbuluxa Akhawunti"
  }
};
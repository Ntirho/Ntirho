import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { passwordsMatchValidator } from '../../../services/auth';
import { Database } from '../../../services/database';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Language, LanguageService } from '../../../services/language';

@Component({
  selector: 'app-reset-password',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword implements OnInit{
  form!: FormGroup; 

  message = '';

  // Language
  currentLang: Language = 'en';
  translations: any = {};

  constructor(
    private fb: FormBuilder, 
    private db: Database,
    private router: Router,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    // Set the language
    this.currentLang = this.languageService.getLanguage();
    this.translations = translations; 

    this.form = this.fb.group({
      password: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: passwordsMatchValidator    // For confirming the passwords
    });
  }

  get email() {
    return this.form.get('email');
  }

  async onSubmit() {
    // Touch all the inputs
    this.form.markAllAsTouched();

    if (this.form.valid) {
      const { data, error } = await this.db.updatePassword(this.form.get('password')?.value);
      
      if (error) {
        console.error('Error while updating password.', error);
        return;
      }

      // Let the user know
      alert('Your password has been reset successfully.')

      // Redirect the user to sign in page
      this.router.navigate(['/']);
    }
  }
}

const translations = {
  en: {
    resetPasswordTitle: "Reset Password",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter new password",
    confirmPasswordLabel: "Confirm Password",
    confirmPasswordPlaceholder: "Re-enter new password",
    submit: "Submit",
    errors: {
      passwordRequired: "Password is required.",
      passwordPattern: "Must be at least 8 characters, include uppercase, lowercase, number, and special character.",
      confirmPasswordRequired: "Confirm password is required.",
      passwordMismatch: "Passwords do not match."
    }
  },
  nso: {
    resetPasswordTitle: "Lokisa Phasewete",
    passwordLabel: "Phasewete",
    passwordPlaceholder: "Kenya phasewete ye mpsha",
    confirmPasswordLabel: "Netefatsa Phasewete",
    confirmPasswordPlaceholder: "Kenya phasewete gape",
    submit: "Romela",
    errors: {
      passwordRequired: "Phasewete e a hlokega.",
      passwordPattern: "Bonyane ditlhaka tše 8, go akaretša ditlhaka tše dikgolo, tše nnyane, nomoro le sešupo.",
      confirmPasswordRequired: "Netefatso ya phasewete e a hlokega.",
      passwordMismatch: "Diphasewete ga di swane."
    }
  },
  ts: {
    resetPasswordTitle: "Lungisa Phasiwedi",
    passwordLabel: "Phasiwedi",
    passwordPlaceholder: "Nghenisa phasiwedi leyintshwa",
    confirmPasswordLabel: "Tiyisisa Phasiwedi",
    confirmPasswordPlaceholder: "Nghenisa phasiwedi nakambe",
    submit: "Tumela",
    errors: {
      passwordRequired: "Phasiwedi yi laveka.",
      passwordPattern: "Yi fanele ku va na 8+ timhaka, ku katsa tinyiko, tinomboro, na swifaniso.",
      confirmPasswordRequired: "Tiyisisa phasiwedi ya laveka.",
      passwordMismatch: "Tiphasiwedi a ti fambelani."
    }
  }
};
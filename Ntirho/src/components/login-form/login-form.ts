// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-login-form',
//   imports: [],
//   templateUrl: './login-form.html',
//   styleUrl: './login-form.css'
// })
// export class LoginForm {

// }
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { z } from 'zod';
import { Language, LanguageService } from '../../services/language';
import { AuthService } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';
import { FormControl } from '@angular/forms';
//import { ToastService } from '../../services/toast';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Database } from '../../services/database';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

type LoginFormType = {
  email: FormControl<string>;
};

@Component({
  selector: 'app-login-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class LoginForm implements OnInit {
  form!: FormGroup;
  isLoading = false;
  emailConfirmation = false;
  translations: any = {};
  currentLang: Language = 'en';

  constructor(
    private languageService: LanguageService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private db: Database,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Set the language
    this.currentLang = this.languageService.getLanguage();
    this.languageService.language$.subscribe(x => {
      this.currentLang = x;
    });
    this.translations = translations;
    
    this.form = this.fb.group({
      email: ["", Validators.required],
      password: ['', Validators.required]
    });
  }

  async onSubmit() {
    // Touch all the form inputs
    this.form.markAllAsTouched();

    if (this.form.invalid){ 
      console.warn('The form is incomplete.');
      return;
    }
    this.isLoading = false;

    try {
      const email = this.form.get('email')?.value;
      const password = this.form.get('password')?.value; 
      const { data, error } = await this.authService.loginUser({ email: email, password: password });

      if (error){
          console.error('Error while signing in.', error);

          // For email confirmation request
          if (error.message.includes('Email not confirmed')){
            await this.db.resendEmailConfirmation(email);

            // Notify the user
            alert('Please check your email inbox/spam/junk for email confirmation.');
          }

          // For invalid cerdentials
          if (error.message.includes('Invalid login credentials')){
            // Notify the user
            alert('Invalid credentials.');
          }

          return;
        }

        // Find user_id
        const user_id = data?.user?.id;

      if (data?.user?.aud.includes('authenticated') && user_id) {
        // Set the user_id in the auth
        await this.authService.setUserId(user_id);

        setTimeout(() => {
          this.authService.login();
          //this.toast.show(this.translations.loginSuccessTitle, this.translations.welcomeBack);
          this.router.navigate(['/jobs']);
        }, 2000);
      } else {
        alert('Could not be authenticated.');
        throw new Error('Not authenticated');
      }
    } catch (error: any) {
      console.error(this.translations.loginFailedTitle, error.message || this.translations.loginFailedDesc, 'error');
      this.isLoading = false;
    }
  }

  // For handling forgot password
  openModal = false;
  email: string = '';
  emailPresent = false;

  async onOpenModal(){
    this.openModal = true;
  }

  closeModal(){
    this.openModal = false;
  }

  // Handles resend 
  async onEmailSubmit(){
    // Set the emailPersent
    this.emailPresent = true;

    // Verify the email
    if (this.email) {
      // Send the email
      await this.db.resetPassword(this.email);

      // Close modal
      this.openModal = false;
      this.cdr.detectChanges();

      // Notify user
      alert('Email has been sent to your email.')
    }
  }
}

const translations = {
  en: {
    welcomeBack: "Welcome Back",
    magicLinkPrompt: "Enter your email to receive a magic login link.",
    emailPlaceholder: "Email address",
    emailError: "Please enter your email.",
    passwordPlaceholder: "Password",
    passwordError: "Please enter your password.",
    login: "Login",
    forgotPassword: "Forgot password",
    resetPasswordTitle: "Reset Your Password",
    emailLabel: "Email address",
    requiredField: "Required",
    resetInstructions: "We’ll send a secure link to reset your password. Make sure it’s the email you used to sign up.",
    sendResetLink: "Send Reset Link"
  },
  nso: {
    welcomeBack: "Rea go amogela gape",
    magicLinkPrompt: "Tsenya imeile ya gago go amogela sehokelo sa go tsena.",
    emailPlaceholder: "Aterese ya imeile",
    emailError: "Tsenya imeile ya gago.",
    passwordPlaceholder: "Phasewete",
    passwordError: "Tsenya phasewete ya gago.",
    login: "Kena",
    forgotPassword: "Le lebetse phasewete",
    resetPasswordTitle: "Lokisa Phasewete",
    emailLabel: "Aterese ya imeile",
    requiredField: "Tlhokega",
    resetInstructions: "Re tla romela sehokelo se se sireletsegileng sa go lokisa phasewete ya gago.",
    sendResetLink: "Romela Sehokelo sa Lokisa"
  },
  ts: {
    welcomeBack: "Amukelekile nakambe",
    magicLinkPrompt: "Nghenisa email ya wena ku kuma link ya ku nghena.",
    emailPlaceholder: "Address ya email",
    emailError: "Nghenisa email ya wena.",
    passwordPlaceholder: "Phasiwedi",
    passwordError: "Nghenisa phasiwedi ya wena.",
    login: "Nghena",
    forgotPassword: "U rivalele phasiwedi",
    resetPasswordTitle: "Lungisa Phasiwedi",
    emailLabel: "Address ya email",
    requiredField: "Swi laveka",
    resetInstructions: "Hi ta ku rhumela link leyi sirhelelekeke ya ku lungisa phasiwedi.",
    sendResetLink: "Tumela Link ya Lungisa"
  }
};

/**
 * if (error){
          console.error('Error while signing in.', error);
          return;
        }

        var success = false;
        if (data.user?.aud === "authenticated"){
          success = true;
        }

        // Find user_id
        const user_id = await this.db.getUserByEmail(formData.email);

        return { success, user_id}
 */
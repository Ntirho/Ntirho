// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-login-form',
//   imports: [],
//   templateUrl: './login-form.html',
//   styleUrl: './login-form.css'
// })
// export class LoginForm {

// }
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@ngneat/reactive-forms';
import { ReactiveFormsModule } from '@angular/forms';
import { z } from 'zod';
import { LanguageService } from '../../services/language';
import { AuthService } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';
import { FormControl } from '@angular/forms';
//import { ToastService } from '../../services/toast';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

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
    ReactiveFormsModule
  ],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class LoginForm implements OnInit {
  form!: FormGroup<LoginFormType>;
  isLoading = false;
  translations: any = {};

  constructor(
    private languageService: LanguageService,
    private authService: AuthService,
    //private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.translations = this.languageService.translations;
    this.form = new FormGroup({
      email: new FormControl ("", { nonNullable: true }),
    });
  }

  async onSubmit() {
    if (this.form.invalid) return;
    this.isLoading = false;

    try {
      const result = await this.authService.loginUser({ email: "", password: "string" });

      if (result.success) {
        //this.toast.show(this.translations.magicLinkSentTitle, this.translations.magicLinkSentDesc);

        setTimeout(() => {
          this.authService.login();
          //this.toast.show(this.translations.loginSuccessTitle, this.translations.welcomeBack);
          this.router.navigate(['/jobs']);
        }, 2000);
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      //this.toast.show(this.translations.loginFailedTitle, error.message || this.translations.loginFailedDesc, 'error');
      this.isLoading = false;
    }
  }
}

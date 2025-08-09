// login-form.ts
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@ngneat/reactive-forms';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { LanguageService } from '../../services/language';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

type LoginFormType = {
  email: FormControl<string>;
  password: FormControl<string>;
};

@Component({
  selector: 'app-login-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginForm implements OnInit {
  form!: FormGroup<LoginFormType>;
  isLoading = false;
  translations: any = {};

  constructor(
    private languageService: LanguageService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.translations = this.languageService.translations;
    this.form = new FormGroup({
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6)]
      }),
    });
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const email = this.form.controls.email.value;
const password = this.form.controls.password.value;

    try {
      const result = await this.authService.signInWithEmailPassword(email, password);
      if (result.success) {
        this.router.navigate(['/jobs']);
      } else {
        alert(result.message || 'Login failed.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    } finally {
      this.isLoading = false;
    }
  }
}

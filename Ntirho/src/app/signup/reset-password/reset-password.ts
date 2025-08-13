import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { passwordsMatchValidator } from '../../../services/auth';
import { Database } from '../../../services/database';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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

  constructor(
    private fb: FormBuilder, 
    private db: Database,
    private router: Router
  ) {}

  ngOnInit(): void {
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

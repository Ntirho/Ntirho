import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Database } from '../../services/database';
import { AuthService } from '../../services/auth';


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
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    // Get user_id
    const user_id = this.auth.getUserId();    
    console.log('The form is valid. User id: ', user_id);

    this.form = this.fb.group({
      institution: ['', Validators.required],
      qualification: ['', Validators.required],
      start_date: [''],
      completion_date: [''],
      average: [50],
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
      const results = await this.db.insertEducation(this.form.value);
      if ( results.error ) {
        throw results.error;
      }

      // Alert the user
      alert('Your qualification has been successfully inserted.');
      
      // Clear form
      this.form.reset();
    } catch (error) {
      console.error('Error while posting a qualification.', error);
      this.isLoading = false;
    } finally {
      this.isLoading = false;
    }
  }
}

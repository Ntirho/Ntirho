import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Database } from '../../services/database';


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
  @Input() userId!: number;

  qualifications = [
    'Matric',
    'Diploma',
    'Degree',
    'Honours',
    'Masters',
    'PhD'
  ];

  constructor(private fb: FormBuilder, 
    private db: Database
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      institution: ['', Validators.required],
      qualification: ['', Validators.required],
      start_date: [''],
      completion_date: [''],
      average: [50],
    });
  }

  isLoading = false;
  async onSubmit() {
    this.form.markAllAsTouched();

    console.log('Form status:', this.form.status);
    console.log('Form value:', this.form.value);


    if (this.form.invalid){     
      console.log('The form is invalid.');
      return;
    }

    this.isLoading = true;

    console.log('The form is valid.');
    try {
      const results = await this.db.insertEducation(this.form.value, this.userId);
      if ( results.error ) {
        console.error('Error while posting qualification.', results.error);
        throw results.error;
      }

      // Alert the user
      alert('Your qualification has been successfully inserted.');
      
      // Clear form
      this.form.reset();
    } catch (error) {
      console.error('Error while posting a qualification.', error);
    } finally {
      this.isLoading = false;
    }
  }
}

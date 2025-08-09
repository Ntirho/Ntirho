import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-education-form',
  imports: [
    CommonModule
  ],
  templateUrl: './education-form.html',
  styleUrl: './education-form.css'
})
export class EducationForm implements OnInit {
  form!: FormGroup;

  qualifications = [
    'Matric',
    'Diploma',
    'Degree',
    'Honours',
    'Masters',
    'PhD'
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      institution: ['', Validators.required],
      qualification: ['', Validators.required],
      startDate: ['', Validators.required],
      completionDate: ['', Validators.required],
      academicAverage: [50],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Education Submitted:', this.form.value);
    } else {
      console.log('Form Invalid');
    }
  }
}

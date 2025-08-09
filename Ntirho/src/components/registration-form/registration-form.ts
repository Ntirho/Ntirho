import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { LanguageService } from '../../services/language';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { isValid } from 'zod';

@Component({
  selector: 'app-registration-form',
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './registration-form.html',
  styleUrl: './registration-form.css'
})
export class RegistrationForm implements OnInit {
  personalDetailsForm!: FormGroup;
  isLoading = false;
  showSkills = true;
  translations: any = {};
  skillsList = skillsList;

  showDisabilityDetails = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private languageService: LanguageService
  ) { }

  ngOnInit () {
    this.translations = this.languageService.translations;

    this.personalDetailsForm = this.fb.group({
      fullNames: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contact: this.fb.group({
        countryCode: ['+27', Validators.required],
        phone: ['', Validators.required],
      }),
      dob: ['', Validators.required],
      sex: ['', Validators.required],
      ethnicity: ['', Validators.required],
      homeLanguage: ['', Validators.required],
      location: ['', Validators.required],
      hasLicense: [false],
      hasDisability: [false],
      disabilityDetails: [''],
    });

    this.personalDetailsForm.get('hasDisability')?.valueChanges.subscribe(val => {
      this.showDisabilityDetails = val;
      if (!val) {
        this.personalDetailsForm.get('disabilityDetails')?.reset();
      }
    });
  }

  // Boolean to control visiblity of required
  isValidated = true;
  async onSubmit() {
    if (this.personalDetailsForm.valid) {
      console.log('Form Submitted:', this.personalDetailsForm.value);
      this.isValidated = true;
    } else {
      console.log('Form Invalid');
      this.isValidated = false;
    }
  }

  toggleSkill(skill: string) {
    const current = this.personalDetailsForm.value.skills;
    const updated = current.includes(skill)
      ? current.filter((s: string) => s !== skill)
      : [...current, skill];
    this.personalDetailsForm.patchValue({ skills: updated });
  }

  isSelected(skill: string): boolean {
    return this.personalDetailsForm.value.skills.includes(skill);
  }
}


const skillsList = [
  { label: "Construction", value: "construction" },
  { label: "Farming", value: "farming" },
  { label: "Retail", value: "retail" },
  { label: "Hospitality", value: "hospitality" },
  { label: "Driving", value: "driving" },
  { label: "Domestic Work", value: "domestic_work" },
  { label: "Other", value: "other" },
] as const;
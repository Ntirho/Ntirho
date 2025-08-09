import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LanguageService } from '../../services/language';
import { AuthService } from '../../services/auth';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Skills list defined OUTSIDE the component
const skillsList = [
  { label: "Construction", value: "construction" },
  { label: "Farming", value: "farming" },
  { label: "Retail", value: "retail" },
  { label: "Hospitality", value: "hospitality" },
  { label: "Driving", value: "driving" },
  { label: "Domestic Work", value: "domestic_work" },
  { label: "Other", value: "other" },
] as const;

@Component({
  selector: 'app-registration-form',
  standalone: true,
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
  showDisabilityDetails = false;

  //  Now references the constant above
  skillsList = skillsList;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private languageService: LanguageService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.translations = this.languageService.translations;

    this.personalDetailsForm = this.fb.group({
      fullNames: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
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
      skills: [[]], // initial value is an empty array
    });

    this.personalDetailsForm.get('hasDisability')?.valueChanges.subscribe(val => {
      this.showDisabilityDetails = val;
      if (!val) {
        this.personalDetailsForm.get('disabilityDetails')?.reset();
      }
    });
  }

  // Boolean to control validation display
  isValidated = true;

async onSubmit() {
  if (this.personalDetailsForm.invalid) {
    this.isValidated = false;
    return;
  }

  this.isLoading = true;
  const formData = this.personalDetailsForm.value;

  // Check if passwords match
  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match.");
    this.isLoading = false;
    return;
  }

  try {
    const result = await this.authService.signUp(formData.email, formData.password);

    if (result.success) {
      alert('Registration successful! Please check your email to verify your account.');
      this.personalDetailsForm.reset();
      this.router.navigate(['/']);
    } else {
      // Handle the error message returned from signUp
      alert(result.message || 'Registration failed. Please try again.');
    }
  } catch (err) {
    console.error(err);
    alert('An unexpected error occurred. Please try again.');
  } finally {
    this.isLoading = false;
  }
}




  // Skills checkbox logic
  toggleSkill(skill: string) {
    const currentSkills = this.personalDetailsForm.value.skills;
    const updated = currentSkills.includes(skill)
      ? currentSkills.filter((s: string) => s !== skill)
      : [...currentSkills, skill];
    this.personalDetailsForm.patchValue({ skills: updated });
  }

  isSelected(skill: string): boolean {
    return this.personalDetailsForm.value.skills.includes(skill);
  }
}

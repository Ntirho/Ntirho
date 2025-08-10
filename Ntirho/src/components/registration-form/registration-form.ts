import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { LanguageService } from '../../services/language';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { isValid } from 'zod';
import { Database } from '../../services/database';
import { User } from '../../interfaces';

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

  // Input for the form
  @Input() user_id!: number;
  @Input() email!: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private languageService: LanguageService,
    private db: Database
  ) { }

  ngOnInit () {
    this.translations = this.languageService.translations;

    this.personalDetailsForm = this.fb.group({
      fullNames: ['', [
        Validators.required, 
        Validators.pattern(/^[a-zA-Z ]{2,}$/)
      ]],
      email: [this.email, [Validators.required, Validators.email]],
      contact: this.fb.group({
        countryCode: ['+27', Validators.required],
        phone: ['', [
          Validators.required,
          Validators.pattern(/^\d{9,10}$/)
        ]],
      }),
      date_of_birth: ['', Validators.required],
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
    // Run the test
    //await this.db.testInsert();

    if (this.personalDetailsForm.valid) {
      // Insert the user
      const formValue = this.personalDetailsForm.value;

      const userPayload = {
        full_names: formValue.fullNames,
        email: formValue.email,
        code: formValue.contact.countryCode,
        cell: formValue.contact.phone,
        date_of_birth: formValue.date_of_birth,
        sex: formValue.sex === 'male' ? 'M' : formValue.sex === 'female' ? 'F' : '',
        ethnicity: formValue.ethnicity,
        home_language: formValue.homeLanguage,
        location: formValue.location,
        driver_license: formValue.hasLicense,
        has_disability: formValue.hasDisability,
        date_created: new Date().toISOString()
      };

        try {
          const result = await this.db.insertUser(userPayload);

          if (result.error)
            throw result.error;

          // Notify the user 
          alert('You have been successfully registered.');

          // Redirect them to the Landing page
          this.router.navigate(['/']);
        } catch (error) {
          console.error('Error while inserting user.', error);
        }

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
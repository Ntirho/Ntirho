import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LanguageService } from '../../services/language';
import { ProfileFormValues } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

// Type for the profile form
type ProfileFormType = {
  location: FormControl<string>;
  skills: FormControl<Array<string>>;
  interest: FormControl<Array<string>>;
};

@Component({
  selector: 'app-profile-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterOutlet
  ],
  templateUrl: './profile-form.html',
  styleUrl: './profile-form.css'
})
export class ProfileForm implements OnInit{
  @Input() user!: ProfileFormValues;
  @Output() save = new EventEmitter<ProfileFormValues>();

  form!: FormGroup;
  isLoading = false;
  translations: any = {};
  skillsList = skillsList;

  constructor(
    private fb: FormBuilder,
    //private toast: ToastService,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    // Translations
    this.translations = this.languageService.translations;

    // For the form
    this.form = this.fb.group({
      name: [this.user.name, Validators.required],
      location: [this.user.location, Validators.required],
      skills: [this.user.skills]
    });
  }

  async onSubmit() {
    if (this.form.invalid) return;

    // this.isLoading = true;
    // try {
    //   await updateUserProfile(this.form.value);
    //   this.toast.show(
    //     this.translations.profileUpdateSuccessTitle,
    //     this.translations.profileUpdateSuccessDesc,
    //     'success'
    //   );
    //   this.save.emit(this.form.value);
    // } catch (err) {
    //   this.toast.show(
    //     this.translations.profileUpdateErrorTitle,
    //     this.translations.profileUpdateErrorDesc,
    //     'error'
    //   );
    // } finally {
    //   this.isLoading = false;
    // }
  }

  toggleSkill(skill: string) {
    const currentSkills = this.form.value.skills || [];
    const updatedSkills = currentSkills.includes(skill)
      ? currentSkills.filter((s: string) => s !== skill)
      : [...currentSkills, skill];
    this.form.patchValue({ skills: updatedSkills });
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
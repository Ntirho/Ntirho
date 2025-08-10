import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { LanguageService } from '../../services/language';
import { CommonModule } from '@angular/common';
import { Database } from '../../services/database';
import { error } from 'console';

@Component({
  selector: 'app-job-posting-form',
  imports: [
    ReactiveFormsModule,
    CommonModule
],
  templateUrl: './job-posting-form.html',
  styleUrl: './job-posting-form.css'
})
export class JobPostingForm implements OnInit{
  form: FormGroup;
  isLoading = false;
  showSkills = false;
  skillsList = skillsList;
  translations: any = {};

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private languageService: LanguageService,
    private db: Database
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      company: ['', [Validators.required, Validators.minLength(2)]],
      location: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      skills: [[]]
    });
  }

  ngOnInit(): void {
      this.translations = this.languageService.translations;
  }

  // Set when the button is pressed
  triedValidation = false;

  async onSubmit() {
    this.form.markAllAsTouched();

    if (this.form.invalid){
      this.triedValidation = true;      
      console.log('The form is invalid.');

      return;
    }

    this.isLoading = true;
    this.triedValidation = false;

    console.log('The form is valid.');
    try {
      const results = await this.db.insertJob(this.form.value);
      if ( results.error ) {
        console.error('Error while posting a job.', results.error);
        throw results.error;
      }

      // Alert the user
      alert('Your job has been successfully inserted.');
      
      // Clear form
      this.form.reset();
    } catch (error) {
      console.error('Error while posting a job.', error);
    } finally {
      this.isLoading = false;
    }
  }

  toggleSkill(skill: string) {
    const current = this.form.value.skills ?? [];
    const updated = current.includes(skill)
      ? current.filter((s: string) => s !== skill)
      : [...current, skill];
    this.form.patchValue({ skills: updated });
  }
  isSelected(skill: string): boolean {
    const skills = this.form.value.skills;
    return Array.isArray(skills) && skills.includes(skill);
  }

  // toggleSkill(skill: string) {
  //   const current = this.form.value.skills;
  //   const updated = current.includes(skill)
  //     ? current.filter((s: string) => s !== skill)
  //     : [...current, skill];
  //   this.form.patchValue({ skills: updated });
  // }

  // isSelected(skill: string): boolean {
  //   return this.form.value.skills.includes(skill);
  // }

  getSelectedSkillLabels(): string {
    return this.form.value.skills
      .map((skill: string)  => this.skillsList.find(s => s.value === skill)?.label)
      .filter((label: string) => !!label)
      .join(', ');
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

export interface Skill {
  label: string,
  value: string
}
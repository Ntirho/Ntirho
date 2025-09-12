import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { Language, LanguageService } from '../../services/language';
import { CommonModule } from '@angular/common';
import { Database } from '../../services/database';
import { error } from 'console';
import { Job } from '../../interfaces';

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
  currentLang: Language = 'en';

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
      skills: ['']
    });
  }

  ngOnInit(): void {
    // Set the language
    this.currentLang = this.languageService.getLanguage();
    this.languageService.language$.subscribe(x => {
      this.currentLang = x;
      this.translations = translations[this.currentLang];
    });
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

    // Form value
    const formValue: Job = this.form.value;
    const skills = this.form.get('skills')?.value;
    formValue.skills = skills.trim().split(',');

    console.log('The form is valid. Skills: ', formValue.skills);
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

const translations = {
  en: {
    jobTitleLabel: "Job Title",
    jobTitlePlaceholder: "e.g. Software Engineer",
    jobTitleError: "Required. Please enter a valid job title.",
    companyLabel: "Company",
    companyPlaceholder: "e.g. Microsoft",
    companyError: "Required. Please enter a valid company name.",
    locationLabel: "Location",
    locationPlaceholder: "e.g. Polokwane, Limpopo",
    locationError: "Required. Please enter a valid location.",
    descriptionLabel: "Job Description",
    descriptionPlaceholder: "Brief summary of the role and responsibilities",
    descriptionError: "Required. Please enter a valid job description.",
    skillsLabel: "Required Skills",
    skillsPlaceholder: "Enter relevant skills",
    skillsDescription: "Write the skills that best match this job. Must be comma-separated.",
    skillsError: "Required. Please enter the appropriate skills.",
    postJobButton: "Post Job"
  },
  nso: {
    jobTitleLabel: "Tirelo ya Mošomo",
    jobTitlePlaceholder: "mohl. Moenjineri wa Software",
    jobTitleError: "Tlhokega. Tsenya leina la mošomo le le nepagetšego.",
    companyLabel: "Kgwebo",
    companyPlaceholder: "mohl. Microsoft",
    companyError: "Tlhokega. Tsenya leina la kgwebo le le nepagetšego.",
    locationLabel: "Lefelo",
    locationPlaceholder: "mohl. Polokwane, Limpopo",
    locationError: "Tlhokega. Tsenya lefelo le le nepagetšego.",
    descriptionLabel: "Tlhaloso ya Mošomo",
    descriptionPlaceholder: "Kakaretšo ya mošomo le maikarabelo",
    descriptionError: "Tlhokega. Tsenya tlhaloso ya mošomo ye e nepagetšego.",
    skillsLabel: "Bokgoni bjo bo Nyakegago",
    skillsPlaceholder: "Kgetha bokgoni bjo bo maleba",
    skillsDescription: "Kgetha bokgoni bjo bo swanago le mošomo wo.",
    skillsError: "Tlhokega. Kgetha bokgoni bjo bo maleba.",
    postJobButton: "Romela Mošomo"
  },
  ts: {
    jobTitleLabel: "Xivumbeko xa ntirho",
    jobTitlePlaceholder: "xik. Injiniya ya Software",
    jobTitleError: "Swi laveka. Nghenisa xivumbeko xa ntirho lexi nga ntiyiso.",
    companyLabel: "Kampani",
    companyPlaceholder: "xik. Microsoft",
    companyError: "Swi laveka. Nghenisa vito ra khampani leri nga ntiyiso.",
    locationLabel: "Ndhawu",
    locationPlaceholder: "xik. Polokwane, Limpopo",
    locationError: "Swi laveka. Nghenisa ndhawu leyi nga ntiyiso.",
    descriptionLabel: "Nhlamuselo ya ntirho",
    descriptionPlaceholder: "Nhlamuselo ya ntirho ni vutihlamuleri",
    descriptionError: "Swi laveka. Nghenisa nhlamuselo ya ntirho leyi nga ntiyiso.",
    skillsLabel: "Vutivi byo lavekaka",
    skillsPlaceholder: "Khetha vutivi lebyi fambelanaka",
    skillsDescription: "Khetha vutivi lebyi fambelanaka na ntirho lowu.",
    skillsError: "Swi laveka. Khetha vutivi lebyi faneleke.",
    postJobButton: "Tumela Ntirho"
  }
};

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
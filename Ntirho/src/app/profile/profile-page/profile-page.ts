import { Component, NgModule, OnInit } from '@angular/core';
import { LanguageService } from '../../../services/language';
import { ProfileForm } from "../../../components/profile-form/profile-form";
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RegistrationForm } from '../../../components/registration-form/registration-form';
import { EducationForm } from "../../../components/education-form/education-form";
import { FormBuilder, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-page',
  imports: [
    CommonModule,
    RegistrationForm,
    EducationForm,
    ReactiveFormsModule
],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css'
})
export class ProfilePage {
  user = mockUser; // Replace with actual user service later
  translations: any = {};
  isEditDialogOpen = false;
  skillDisplay: Record<string, string> = {
    construction: this.translations.skillConstruction,
    driving: this.translations.skillDriving,
    retail: this.translations.skillRetail,
    hospitality: this.translations.skillHospitality,
    farming: this.translations.skillFarming,
    other: this.translations.skillOther
  };

  // Form helpers
  addingSkills = false;
  addingInterests = false;
  addingEducation = false;
  editingDetails = false;
  editingAbout = false;
  skillForm = new FormControl('', Validators.required);
  interestForm = new FormControl('', Validators.required);

  // Dummy data
  qualifications: any = [];
  dummyEducation = {
    institution: 'Lancea Vale Secondary School',
    qualification: 'Matric',
    startDate: '2018-01-15',
    completionDate: '2022-12-01',
    academicAverage: 78
  };
  submittedData = {
    fullNames: 'Thabo Mbeki',
    email: 'thabo.m@example.com',
    contact: {
      countryCode: '+27',
      phone: '0781234567',
    },
    dob: '1990-06-15',
    sex: 'male',
    ethnicity: 'black',
    homeLanguage: 'sepedi',
    location: 'Polokwane',
    hasLicense: true,
    hasDisability: true,
    disabilityDetails: 'Visual impairment',
  };

  constructor(private languageService: LanguageService,
              private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.translations = this.languageService.translations;
  }

  handleProfileUpdate(values: any) {
    this.user = {
      ...this.user,
      name: values.name,
      location: values.location,
      skills: values.skills
    };
    this.isEditDialogOpen = false;
  }

  openEditDialog() {
    this.isEditDialogOpen = true;
  }

  closeEditDialog() {
    this.isEditDialogOpen = false;
  }

  // Form functions
  onAddSkills(){
    this.addingSkills = !this.addingSkills;
  }

  onAddInterests(){
    this.addingInterests = !this.addingInterests;
  }
  onEditDetails(){
    this.editingDetails = !this.editingDetails;
  }
  onAddEducation(){
    this.addingEducation = !this.addingEducation;
  }
  onEditAbout(){
    this.editingAbout = ! this.editingAbout;
  }

  onEnterSkill(){

  }

  onEnterInterest(){

  }
}


// Mock user data, in a real app this would come from an auth context or API call
const mockUser = {
  name: 'Thabo Mbeki',
  email: 'thabo.m@example.com',
  location: 'Polokwane',
  skills: ['construction', 'driving', 'retail'],
  interests: ['Community Projects', 'Learning New Skills'],
  avatarUrl: 'https://placehold.co/100x100.png',
};

const skillDisplay: Record<string, string> = {
  construction: 'Construction',
  driving: 'Driving',
  retail: 'Retail',
  farming: 'Farming',
  hospitality: 'Hospitality',
  domestic_work: 'Domestic Work',
  other: 'Other',
};
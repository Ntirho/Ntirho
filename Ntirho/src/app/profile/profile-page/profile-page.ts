import { ChangeDetectorRef, Component, Input, NgModule, OnInit } from '@angular/core';
import { LanguageService } from '../../../services/language';
import { ProfileForm } from "../../../components/profile-form/profile-form";
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RegistrationForm } from '../../../components/registration-form/registration-form';
import { EducationForm } from "../../../components/education-form/education-form";
import { FormBuilder, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Education, User } from '../../../interfaces';
import { Database } from '../../../services/database';
import { AuthService } from '../../../services/auth';

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
  qualifications: Education[] = [];
  submittedData!: User;
  disability!: string;

  // Get the user_id
  user_id: number = 1;

  constructor(private languageService: LanguageService,
              private fb: FormBuilder,
              private db: Database,
              private cdr: ChangeDetectorRef,
              private auth: AuthService
  ) {}

  ngOnInit() {
    this.translations = this.languageService.translations;

    // Update the user_id
    this.user_id = this.auth.getUserId() ?? 1; 
    console.log('User id', this.user_id);

    // Call the fetch data
    this.fetchData();
  }

  // Function to fetch data
  async fetchData() {
    // Fetch user details
    await this.db.getUser(this.user_id).then(({user, error}) => {
      if (error){
        console.error('Error while fetching user.', error);
        return;
      }

      this.submittedData = user;

      // Notify the UI of the changes
      this.cdr.detectChanges();
    });

    // Fetch education
    await this.db.getEducation(this.user_id).then((data) => {
      if (!data){
        console.warn('No data for education for the current user.');
        return;
      }

      this.qualifications = data;

      // Notify the UI
      this.cdr.detectChanges();
    });
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
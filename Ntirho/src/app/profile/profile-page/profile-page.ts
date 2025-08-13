import { ChangeDetectorRef, Component, Input, NgModule, OnInit } from '@angular/core';
import { LanguageService } from '../../../services/language';
import { ProfileForm } from "../../../components/profile-form/profile-form";
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RegistrationForm } from '../../../components/registration-form/registration-form';
import { EducationForm } from "../../../components/education-form/education-form";
import { FormBuilder, FormControl, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Education, User, UserAttributes } from '../../../interfaces';
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
  skillForm!: FormGroup;
  interestForm!: FormGroup;
  aboutForm!: FormGroup;

  // Data
  qualifications: Education[] = [];
  submittedData!: User;
  disability!: string;
  attributes!: UserAttributes; 
  skills: string [] = [];
  interests: string [] = [];
  currentAbout!: string;

  // Get the user_id
  user_id: string | null = "";

  constructor(private languageService: LanguageService,
              private fb: FormBuilder,
              private db: Database,
              private cdr: ChangeDetectorRef,
              private auth: AuthService
  ) {}

  ngOnInit() {
    this.translations = this.languageService.translations;

    // Update the user_id
    this.user_id = this.auth.getUserId();

    // Call the fetch data
    this.fetchData();

    // Assemle the forms
    this.skillForm = this.fb.group({
      skill: ['', Validators.required]
    })
    this.interestForm = this.fb.group({
      interest: ['', Validators.required]
    })
    this.aboutForm = this.fb.group({
      about: [this.currentAbout ?? '', Validators.required],
    })

  }

  // Function to fetch data
  async fetchData() {
    // Check user_id
    if(this.user_id === null){
      console.log("Failed to get user_id");
      return;
    }

    // Fetch user details
    await this.db.getUser(this.user_id).then(({data, error}) => {
      if (error){
        console.error('Error while fetching user.', error);
        return;
      }

      // Test user
      console.log('User: ', data);

      this.submittedData = data;

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

    // Fetch user attributes
    await this.db.getUserAttributes(this.user_id).then(({data, error}) => {
      if (error)
        console.error('Error while fetching attributes.', error);

      if (!data) {
        console.warn('No user attributes returned');
        return;
      }

      // Assign the data to the variable
      this.attributes = data;

      // Assign currentAbout, skills and interests
      this.skills = data.skills;
      this.interests = data.interests;
      this.currentAbout = data.About;

      // Assign the about to the about-editor
      this.aboutForm.patchValue({ 'about': this.attributes.about });

      console.log("Profile: ", data);

      // Notify UI
      this.cdr.detectChanges();
    })
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
    //this.editingDetails = !this.editingDetails;
  }
  onAddEducation(){
    this.addingEducation = !this.addingEducation;
  }

  onEditAbout(){
    this.editingAbout = ! this.editingAbout;
    this.aboutForm.get('about')?.enable();
  }

  async onEnterAbout() {
    if(this.aboutForm.valid) {
      // Assign the about
      const about = this.aboutForm.get('about')?.value;

      if (!this.attributes && this.user_id) {
          // Insert  about
          const newAttributes: UserAttributes = {
            user_id: this.user_id,
            skills: [], // or existing skills
            interests: [], 
            about: about,
            date_updated: new Date().toISOString()
          };

          await this.db.insertUserAttributes(newAttributes).then(({data, error}) => {
            if (error){
              console.error('Error while inserting the about', error.message);

              return;
            }
            
            this.attributes = newAttributes;         

            // Notify the user
            alert('About has been added.');

            // Deactivate the edit for about
            this.editingAbout = false;
          });
        } else {
          // Update existing attributes
          this.attributes.about = about;
          this.attributes.date_updated = new Date().toISOString();

          await this.db.updateUserAttributes(this.attributes).then(({data, error}) => {
            if (error){
              console.error('Error while updating the about');
              // Rollback the about to the one in the db
              this.aboutForm.setValue({
                'about': this.currentAbout
              });

              return;
            }
            // Notify the user
            alert('About has been edited');

            // Deactivate the edititng
            this.editingAbout = false;

            // Notify the UI
            this.cdr.detectChanges();
          });
        }
    }
  }

  isLoading = false;
  async onEnterSkill() {
    this.isLoading = true;
    
    if (this.skillForm.valid) {
      // Append to skills
      const skill = this.skillForm.get('skill')?.value;
      if (skill && !this.skills.includes(skill)) {
        this.skills.push(skill);
      }
      else {
        return;
      }

      if (!this.attributes && this.user_id) {
        // Insert new attributes
        const newAttributes: UserAttributes = {
          user_id: this.user_id,
          skills: [...this.skills],
          interests: [], // or existing interests
          about: '',
          date_updated: new Date().toISOString()
        };

        await this.db.insertUserAttributes(newAttributes).then(({data, error}) => {
          if (error){
            console.error('Error while inserting the skill');
            //Remove the skill
            this.skills.pop();

            return;
          }
          this.attributes = newAttributes;

          // Notify the user
          alert('New skill has been added');

          // Reset form
          this.skillForm.reset();
          this.addingSkills = false;
        });
      } 
      else {
        // Update existing attributes
        this.attributes.skills = [...this.skills];
        this.attributes.date_updated = new Date().toISOString();

        await this.db.updateUserAttributes(this.attributes).then(({data, error}) => {
          if (error){
            console.error('Error while updating the skill', error.message);
            //Remove the skill
            this.skills.pop();
            this.cdr.detectChanges();

            // Checking
            console.log("Skills: ", this.attributes)

            return;
          }

          // Notify the user
          alert('New skill has been added');

          // Reset form
          this.skillForm.reset();
          this.addingSkills = false;
        });
      }
    }
  }


  async onEnterInterest(){
    if (this.interestForm.valid) {
      // Append to interests
      const interest = this.interestForm.get('interest')?.value;
      if (interest && !this.interests.includes(interest)) {
        this.interests.push(interest);
      }
      else {
        return;
      }

      if (!this.attributes && this.user_id) {
        // Insert new attributes
        const newAttributes: UserAttributes = {
          user_id: this.user_id,
          skills: [], // or existing skills
          interests: [...this.interests], 
          about: '',
          date_updated: new Date().toISOString()
        };

        await this.db.insertUserAttributes(newAttributes).then(({data, error}) => {
          if (error){
            console.error('Error while inserting the interest');
            //Remove the interest
            this.interests.pop();

            return;
          }
          
          this.attributes = newAttributes;         

          // Notify the user
          alert('New interest has been added');

          // Reset form
          this.interestForm.reset();
          this.addingInterests = false;
        });
      } else {
        // Update existing attributes
        this.attributes.interests = [...this.interests];
        this.attributes.date_updated = new Date().toISOString();

        await this.db.updateUserAttributes(this.attributes).then(({data, error}) => {
          if (error){
            console.error('Error while updating the interest');
            //Remove the interest
            this.interests.pop();
            return;
          }
          // Notify the user
          alert('New interest has been added');

          // Reset form
          this.interestForm.reset();
          this.addingInterests = false;
        });
      }
    }
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
import { ChangeDetectorRef, Component, Input, NgModule, OnInit } from '@angular/core';
import { Language, LanguageService } from '../../../services/language';
import { ProfileForm } from "../../../components/profile-form/profile-form";
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RegistrationForm } from '../../../components/registration-form/registration-form';
import { EducationForm } from "../../../components/education-form/education-form";
import { CertificateForm } from '../../../components/certification-form/certification-form';
import { FormBuilder, FormControl, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { AppUser, Certificate, Education, Experience, User, UserAttributes } from '../../../interfaces';
import { Database } from '../../../services/database';
import { AuthService } from '../../../services/auth';
import { ExperienceForm } from '../../../components/experience-form/experience-form';
import { Editor } from "../../../components/editor/editor";
import { ConfirmDelete } from "../../../components/confirm-delete/confirm-delete";

@Component({
  selector: 'app-profile-page',
  imports: [
    CommonModule,
    RegistrationForm,
    EducationForm,
    CertificateForm,
    ExperienceForm,
    ReactiveFormsModule,
    Editor,
    ConfirmDelete
],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css'
})
export class ProfilePage {
  user = mockUser; // Replace with actual user service later
  translations: any = {};
  currentLang: Language = 'en';
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
  addingCertificate = false;
  addingExperience = false;
  editingDetails = false;
  editingAbout = false;
  skillForm!: FormGroup;
  interestForm!: FormGroup;
  aboutForm!: FormGroup;

  // Data
  qualifications: Education[] = [];
  certificates: Certificate[] = [];
  experiences: Experience[] = [];
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
    // Set the language
    this.currentLang = this.languageService.getLanguage();
    this.translations = translations;

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
      // console.log('User: ', data);

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

    // Fetch certification
    await this.db.getCertificates(this.user_id).then((data) => {
      if (!data){
        console.warn('No data for certification for the current user.');
        return;
      }

      this.certificates = data;

      // Notify the UI
      this.cdr.detectChanges();
    });

    // Fetch experiences
    await this.db.getExperiences(this.user_id).then((data) => {
      if (!data){
        console.warn('No data for experience for the current user.');
        return;
      }

      this.experiences = data;
      // console.log('Experiences:', this.experiences)

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

      // console.log("Profile: ", data);

      // Notify UI
      this.cdr.detectChanges();
    })
  }

  // Editor inputs
  selectedEducation: Education | null = null;
  selectedCertificate: Certificate | null = null;
  selectedExperience: Experience | null = null;
  selectedDetails: AppUser | null = null;

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
    // this.selectedDetails = this.submittedData;
    // this.onOpenEditor();
  }
  onAddEducation(){
    this.addingEducation = !this.addingEducation;
  }
  onAddCertificate(){
    this.addingCertificate = !this.addingCertificate;
  }
  onAddExperience(){
    this.addingExperience = !this.addingExperience;
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

  // Experience
  async onDeleteExprience(exp: Experience) {
    this.selectedExperience = exp;
    this.isDeleteConfirmed = true;
  }
  async onEditExperience(exp: Experience) {
    this.selectedExperience = exp;
    this.onOpenEditor();
  }

  // Education
  async onDeleteEducation(ed: Education) {
    this.selectedEducation = ed;
    this.isDeleteConfirmed = true;
  }
  async onEditEducation(ed: Education) {
    this.selectedEducation = ed;
    this.onOpenEditor();
  }

  // Certificates
  async onDeleteCertificate(cert: Certificate) {
    this.selectedCertificate = cert;
    this.isDeleteConfirmed = true;
  }
  async onEditCertificate(cert: Certificate) {
    this.selectedCertificate = cert;
    this.onOpenEditor();
  }

  // Editor
  isEditorOpen = false;

  onOpenEditor () {
    this.isEditorOpen = true;
  }
  onClodeEditor () {
    this.isEditorOpen = false;

    // Nuliify the selected variables
    this.selectedCertificate = null;
    this.selectedEducation = null;
    this.selectedExperience = null;
    this.selectedDetails = null;
  }

  // Deletion
  isDeleteConfirmed = false;

  onDelete() {
    this.isDeleteConfirmed = true;
  }
  onCloseDelete() {
    this.isDeleteConfirmed = false;

    // Nuliify the selected variables
    this.selectedCertificate = null;
    this.selectedEducation = null;
    this.selectedExperience = null;
    this.selectedDetails = null;
  }
}

const translations = {
  en: {
    aboutMeTitle: "About Me",
    editAboutLabel: "Edit About Section",
    aboutPlaceholder: "Tell us something about yourself...",
    save: "Save",
    errors: {
      aboutRequired: "Required"
    },
    personalDetailsTitle: "Personal Details",
    editDetailsLabel: "Edit Personal Details",
    fullNames: "Full Names",
    email: "Email",
    contact: "Contact",
    dateOfBirth: "Date of Birth",
    sex: "Sex",
    ethnicity: "Ethnicity",
    homeLanguage: "Home Language",
    location: "Current Location",
    driversLicense: "Driver's License",
    disability: "Living with Disabilities",
    disabilityDetails: "Disability Details",
    yes: "Yes",
    no: "No",
    certificationTitle: "Certification",
    addCertificateLabel: "Add Certificate",
    editCertificateLabel: "Edit Certificate",
    deleteCertificateLabel: "Delete Certificate",
    certificateLabel: "Certificate",
    title: "Title",
    issuer: "Issuer",
    issueDate: "Issue Date",
    expiryDate: "Expiry Date",
    credentialUrl: "Credential URL",
    experiencesTitle: "Experiences",
    addExperienceLabel: "Add Experience",
    editExperienceLabel: "Edit Experience",
    deleteExperienceLabel: "Delete Experience",
    experienceLabel: "Experience",
    organization: "Organization",
    description: "Description",
    startDate: "Start Date",
    endDate: "End Date",    
    educationTitle: "Education",
    addEducationLabel: "Add Education",
    editEducationLabel: "Edit Education",
    deleteEducationLabel: "Delete Education",
    educationLabel: "Education",
    institution: "Institution",
    qualification: "Qualification",
    completionDate: "Completion Date",
    academicAverage: "Academic Average",
    skillsTitle: "My Skills",
    addSkillLabel: "Add a new skill",
    enterSkillPlaceholder: "Enter skill",
    requiredField: "Required.",
    enterButton: "Enter",
    myInterests: "My Interests",
    addInterestLabel: "Add a new interest",
    interestPlaceholder: "Interest | hobby | activities"
  },
  nso: {
    aboutMeTitle: "Ka Ga Nna",
    editAboutLabel: "Lokisa Karolo ya Ka Ga Nna",
    aboutPlaceholder: "Re botše ka wena...",
    save: "Boloka",
    errors: {
      aboutRequired: "E a hlokega"
    },
    personalDetailsTitle: "Tshedimosetso ya Botho",
    editDetailsLabel: "Lokisa Tshedimosetso ya Botho",
    fullNames: "Maina a Botlalo",
    email: "Imeile",
    contact: "Kgokagano",
    dateOfBirth: "Letšatši la Matswalo",
    sex: "Bong",
    ethnicity: "Setšhaba",
    homeLanguage: "Polelo ya Gae",
    location: "Lefelo la Bjale",
    driversLicense: "Laesense ya go Driver",
    disability: "Go Phela le Bokgoni bjo bo Fokoditšwego",
    disabilityDetails: "Dintlha tša Bokgoni",
    yes: "Ee",
    no: "Aowa",
    certificationTitle: "Setifikeiti",
    addCertificateLabel: "Tlatša Setifikeiti",
    editCertificateLabel: "Lokisa Setifikeiti",
    deleteCertificateLabel: "Phumula Setifikeiti",
    certificateLabel: "Setifikeiti",
    title: "Thaetlele",
    issuer: "Mofani",
    issueDate: "Letšatši la go Fana",
    expiryDate: "Letšatši la go Fela",
    credentialUrl: "URL ya Setifikeiti",
    experiencesTitle: "Maitemogelo",
    addExperienceLabel: "Tlatša Maitemogelo",
    editExperienceLabel: "Lokisa Maitemogelo",
    deleteExperienceLabel: "Phumula Maitemogelo",
    experienceLabel: "Maitemogelo",
    organization: "Mokgatlo",
    description: "Tlhaloso",
    startDate: "Letšatši la go Thoma",
    endDate: "Letšatši la go Fela",
    educationTitle: "Thuto",
    addEducationLabel: "Tlatša Thuto",
    editEducationLabel: "Lokisa Thuto",
    deleteEducationLabel: "Phumula Thuto",
    educationLabel: "Thuto",
    institution: "Sekolo",
    completionDate: "Letšatši la go Fediša",
    academicAverage: "Karolelano ya Thuto",
    skillsTitle: "Bokgoni bja ka",
    addSkillLabel: "Tlatša bokgoni bjo bofsa",
    enterSkillPlaceholder: "Ngwala bokgoni",
    requiredField: "Bo nyakega.",
    enterButton: "Romela",
    myInterests: "Dithahasello tša ka",
    addInterestLabel: "Tlatša thahasello ye mpsha",
    interestPlaceholder: "Thahasello | boithabišo | mešongwana"
  },
  ts: {
    aboutMeTitle: "Hi Mina",
    editAboutLabel: "Lungisa Xiphemu xa Hi Mina",
    aboutPlaceholder: "Byela hina hi wena...",
    save: "Hlayisa",
    errors: {
      aboutRequired: "Swi laveka"
    },
    personalDetailsTitle: "Vuxokoxoko bya Munhu",
    editDetailsLabel: "Lungisa Vuxokoxoko bya Munhu",
    fullNames: "Mavito ya Hinkwawo",
    email: "Imeili",
    contact: "Nxaxamelo",
    dateOfBirth: "Siku ra Ku velekiwa",
    sex: "Rimbewu",
    ethnicity: "Vuxaka",
    homeLanguage: "Ririmi ra le Kaya",
    location: "Ndhawu ya sweswi",
    driversLicense: "Layisense ya Muchayeri",
    disability: "Ku hanya na Vutshwa",
    disabilityDetails: "Vuxokoxoko bya Vutshwa",
    yes: "Ina",
    no: "E-e",
    certificationTitle: "Setifiketi",
    addCertificateLabel: "Engetela Setifiketi",
    editCertificateLabel: "Lungisa Setifiketi",
    deleteCertificateLabel: "Susa Setifiketi",
    certificateLabel: "Setifiketi",
    title: "Xivumbeko",
    issuer: "Muendli",
    issueDate: "Siku ra Ku nyiketiwa",
    expiryDate: "Siku ra ku hela",
    credentialUrl: "URL ya Vutivi",
    experiencesTitle: "Vutomi",
    addExperienceLabel: "Engetela Vutomi",
    editExperienceLabel: "Lungisa Vutomi",
    deleteExperienceLabel: "Susa Vutomi",
    experienceLabel: "Vutomi",
    organization: "Nhlangano",
    description: "Nhlamuselo",
    startDate: "Siku ra ku sungula",
    endDate: "Siku ra ku hela",
    educationTitle: "Dyondzo",
    addEducationLabel: "Engetela Dyondzo",
    editEducationLabel: "Lungisa Dyondzo",
    deleteEducationLabel: "Susa Dyondzo",
    educationLabel: "Dyondzo",
    institution: "Xikolo",
    qualification: "Setifiketi",
    completionDate: "Siku ra ku hela",
    academicAverage: "Avhareji ya Tidyondzo",
    skillsTitle: "Vutivi bya Mina",
    addSkillLabel: "Engetela vutivi lebyintshwa",
    enterSkillPlaceholder: "Nghenisa vutivi",
    requiredField: "Swi laveka.",
    enterButton: "Nghenisa",
    myInterests: "Swihoxo swa Mina",
    addInterestLabel: "Engetela xin'wana xa ku tsakela",
    interestPlaceholder: "Ku tsakela | vuhungasi | mintirho"
  }
};


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
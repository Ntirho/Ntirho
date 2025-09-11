import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, Output, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Database } from '../../services/database';
import { AuthService } from '../../services/auth';
import { Education, Subject } from '../../interfaces';
import { Language, LanguageService } from '../../services/language';
import { date } from 'zod';


@Component({
  selector: 'app-education-form',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './education-form.html',
  styleUrl: './education-form.css'
})
export class EducationForm implements OnInit {
  form!: FormGroup;
  subjectForm!: FormGroup;
  @Input() userId: string | null = "";

  // For the editor
  @Input() education: Education | null = null;
  @Output() closeEditor = false;
  id = 0;
  isEdit = false;
  subjects: Subject[] = [];

  // Language
  currentLang: Language = 'en';
  translations: any = {};

  qualifications = [
    'Matric',
    'Diploma',
    'Degree',
    'Honours',
    'Masters',
    'PhD'
  ];

  constructor(private fb: FormBuilder, 
    private db: Database,
    private auth: AuthService,
    public cdr: ChangeDetectorRef,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    // Set the language
    this.currentLang = this.languageService.getLanguage();
    this.languageService.language$.subscribe(x => {
      this.currentLang = x;
      this.translations = translations[this.currentLang];
    });

    // Subject
    //const subject: Subject = {name: 'Mathematics', average:50, subject_id: 0, qualification_id: 0, date_created: ''};
    //this.subjects.push(subject);

    // Get user_id
    const user_id = this.auth.getUserId();    
    console.log('The form is valid. User id: ', user_id);

    // Editor 
    if (this.education){
      this.isEdit = true;
      // this.showAddSubject = true;

      // Set the id
      this.id = this.education.qualification_id

      // Get subjects
      this.getSubjects();
    }

    this.form = this.fb.group({
      institution: [this.education?.institution, Validators.required],
      qualification: [this.education?.qualification, Validators.required],
      name: [this.education?.name, Validators.required],
      start_date: [this.education?.start_date, Validators.required],
      completion_date: [this.education?.completion_date],
      average: [this.education?.average],
      user_id: [user_id]
    });

    this.subjectForm = this.fb.group({
        name: ['', Validators.required],
        average: [50]
      })
  }

  // Add subject
  selectedSubject!: Subject;
  async addSubject(){
    const formValue = this.subjectForm.value;  

    if(formValue) {
      const subj: Subject = formValue;
      subj.subject_id = this.selectedSubject.subject_id;
      // subj.qualification_id = this.selectedSubject.qualification_id;

      // Add subject
      if (this.isEdit) {
        // update db
        await this.db.updateSubject(subj, subj.subject_id).then(data => {
          // Error
          if(data.error) {
            console.log('Error while updating subject.', data.error);
            return;
          }

          // Remove original
          this.subjects = this.subjects.filter(x => x.name !== this.selectedSubject.name);

          // Add updated
          if (data.data)
            this.subjects = [...this.subjects, data.data[0]];

          // Close add subject
          this.showAddSubject = false;
        });        
        
      }
      else {
        if (!this.subjects.find(s => s.name.trim().toLowerCase() === subj.name.trim().toLowerCase()))
          this.subjects = [...this.subjects, subj];
      }
      console.log('Subjects: ', this.subjects);

      // Reset the form for subject
      this.subjectForm.reset();

      // Update the UI
      this.cdr.markForCheck();
    }
    else
      console.log('Subject form not valid.');
  }

  // Edit subject
  showAddSubject = false;
  editSubject(subj: Subject) {
    // Fill in the subject form
    this.subjectForm = this.fb.group({
      name: [subj.name, Validators.required],
      average: [subj.average]
    });

    // Show form
    this.showAddSubject = true;

    // Assign
    this.selectedSubject = subj;
  }
  updateSubject(){

  }

  // Remove subject
  removeSubject(subj: string){
    // Remove subject using filtering
    console.log('Removing subject:', subj)
    this.subjects = this.subjects.filter(x => x.name !== subj)

    // Update the UI
      this.cdr.markForCheck();
  }

  // Get subjects
  async getSubjects() {
    if(this.education)
      await this.db.getSubjects(this.education?.qualification_id).then(data => {
        this.subjects = data;
        console.log(this.subjects);

        // Alert the UI
        this.cdr.markForCheck();
      });
  }

  isLoading = false;
  async onSubmit() {
    this.form.markAllAsTouched();

    if (this.form.invalid && !this.checkSubjectCount().check){     
      console.log('The form is invalid.');
      return;
    }

    this.isLoading = true;
    
    try {
      const results = !this.isEdit ?
        await this.db.insertEducation(this.form.value) :
        await this.db.updateEducation(this.form.value, this.id);
      if ( results.error ) {
        throw results.error;
      }

      // Alert the user
      if (!this.isEdit && results.data){
        // Get the inserted qualification
        const qualification: Education = results.data[0];
        console.log('Qualification inserted: ', results.data[0]);

        // Add the subject
        this.subjects.forEach(subj => {
          subj.qualification_id = qualification.qualification_id;
          this.db.insertSubject(subj);
        });

        // Alert the user
        alert('Your qualification has been successfully inserted.');
      }
      else
        alert('Your qualification has been successfully updated.');
      
      // Clear form
      this.form.reset();
      this.subjects = [];

      // Switch off the loader
      this.isLoading = false;

      // Update popup
      this.closeEditor = true;
    } catch (error) {
      console.error('Error while posting a qualification.', error);
      this.isLoading = false;
    } finally {
      this.isLoading = false;
    }
  }

  // Check subjects count
  checkSubjectCount() {
    // Get the qualification
    const qualification = this.form.get('qualification')?.value;

    switch(qualification) {
      case 'Matric':
        if (this.subjects.length >= 7)
          return {check: true, count: 7};
        else
          return {check: false, count: 7};
      case 'Honours':
        if (this.subjects.length >= 4)
          return {check: true, count: 4};
        else
          return {check: false, count: 4};
      case 'Degree':
        if (this.subjects.length >= 4)
          return {check: true, count: 4};
        else
          return {check: false, count: 4};
      case 'Diploma':
        if (this.subjects.length >= 4)
          return {check: true, count: 4};
        else
          return {check: false, count: 4};
      default:
        return {check: true, count: 0};
    }
  }
}


const translations = {
  en: {
    institutionLabel: "School or Institution",
    institutionPlaceholder: "e.g. Lancea Vale Secondary School",
    qualificationLabel: "Qualification or Study Programme",
    qualificationSelect: "Select",
    name: "Name",
    startDateLabel: "Start Date",
    completionDateLabel: "Completion Date",
    academicAverageLabel: "Academic Average",
    saveEducation: "Save Education",
    saving: "Saving...",
    errors: {
      required: "Required.",
      invalidInstitution: "Please enter a valid institution.",
      invalidQualification: "Please select a qualification.",
      invalidDate: "Please enter a valid date.",
      invalidAverage: "Please enter a valid academic average."
    }
  },
  nso: {
    institutionLabel: "Sekolo goba Mokgatlo",
    institutionPlaceholder: "mohl. Lancea Vale Secondary School",
    qualificationLabel: "Thuto goba Lenaneo la Thuto",
    qualificationSelect: "Kgetha",
    name: "Lena",
    startDateLabel: "Letšatši la go Thoma",
    completionDateLabel: "Letšatši la go Fela",
    academicAverageLabel: "Karolelano ya Thuto",
    saveEducation: "Boloka Thuto",
    saving: "E a bolokega...",
    errors: {
      required: "Ya hlokega.",
      invalidInstitution: "Tsenya leina la sekolo le le nepagetšego.",
      invalidQualification: "Kgetha thuto ye e nepagetšego.",
      invalidDate: "Tsenya letšatši le le nepagetšego.",
      invalidAverage: "Tsenya karolelano ya thuto ye e nepagetšego."
    }
  },
  ts: {
    institutionLabel: "Xikolo kumbe Nhlangano",
    institutionPlaceholder: "xik. Lancea Vale Secondary School",
    qualificationLabel: "Tidyondzo kumbe Ntirho wa dyondzo",
    qualificationSelect: "Hlawula",
    name: "Rivito",
    startDateLabel: "Siku ro sungula",
    completionDateLabel: "Siku ro hetelela",
    academicAverageLabel: "Avhareji ya Tidyondzo",
    saveEducation: "Hlayisa Dyondzo",
    saving: "Ku hlayisiwa...",
    errors: {
      required: "Ya laveka.",
      invalidInstitution: "Nghenisa xikolo lexi lulameke.",
      invalidQualification: "Hlawula dyondzo leyi lulameke.",
      invalidDate: "Nghenisa siku leri lulameke.",
      invalidAverage: "Nghenisa avhareji ya dyondzo leyi lulameke."
    }
  }
};
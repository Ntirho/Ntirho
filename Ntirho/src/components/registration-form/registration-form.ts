import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { Language, LanguageService } from '../../services/language';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { isValid } from 'zod';
import { Database } from '../../services/database';
import { Disability, User } from '../../interfaces';
import { passwordsMatchValidator } from '../../services/auth';

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
  currentLang!: string;
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
    // Set the language
    this.currentLang = this.languageService.getLanguage();
    this.translations = translations;

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
      password: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      confirmPassword: ['', Validators.required]
      }, {
        validators: passwordsMatchValidator    // For confirming the passwords
      })

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
      const email = formValue.email;
      const password = formValue.password;

      try {
        // const result = await this.db.insertUser(userPayload);

        // if (result.error)
        //   throw result.error;

        // // Notify the user 
        // alert('You have been successfully registered.');

        // // Redirect them to the Landing page
        // this.router.navigate(['/']);

        // Sign up
        const { data, error } = await this.db.signUpWithEmailPasswordMetadata(email, password, userPayload);

        // Check for errors
        if(error)
          throw error;

        // Disability insertion
        if (userPayload.has_disability && data.user){
          // Get the user's id
          const id = data.user.id;

          // Create a disability payload
          const disabilityPayload: Disability = {
            user_id: id,
            disability: formValue.disabilityDetails,
            date_created: new Date().toISOString()
          };
          console.log(disabilityPayload);

          // Insert the disability
          const result = await this.db.insertDisability(disabilityPayload);
          if (result.error)
            console.log("Error while inserting disability.", result.error);
        }

        // Notify the user
        alert('Your account has been successfully created.')

        // Redirect them to the Landing page
        this.router.navigate(['/']);

        // Clear form
        this.personalDetailsForm.reset();
      } 
      catch (error) {
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

export const translations = {
  en: {
    fullNames: "Full Names",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    contactDetails: "Contact Details",
    phonePlaceholder: "78 *** ****",
    dob: "Date of Birth",
    sex: "Sex",
    male: "Male",
    female: "Female",
    ethnicity: "Ethnicity",
    african: "African",
    white: "White",
    coloured: "Coloured",
    indian: "Indian",
    homeLanguage: "Home Language",
    sepedi: "Sepedi",
    xitsonga: "Xitsonga",
    tshivenda: "Tshivenda",
    location: "Current Location",
    hasLicense: "I have a valid driver's license",
    hasDisability: "Are you living with disabilities?",
    disabilityPlaceholder: "Please specify",
    select: "Select",
    submit: "Submit",
    posting: "Posting...",
    errors: {
      fullNamesRequired: "Required. Please enter your full name.",
      fullNamesPattern: "Only letters and spaces allowed. Minimum 2 characters.",
      emailRequired: "Required. Please enter your email address.",
      emailInvalid: "Invalid format. Please enter a valid email address.",
      passwordRequired: "Password is required.",
      passwordPattern: "Must be at least 8 characters, include uppercase, lowercase, number, and special character.",
      confirmPasswordRequired: "Confirm password is required.",
      passwordMismatch: "Passwords do not match.",
      phoneRequired: "Required. Please enter your cell number.",
      phonePattern: "Invalid format. Please enter a valid 9-digit cell number.",
      dobRequired: "Required.",
      sexRequired: "Required.",
      ethnicityRequired: "Required.",
      homeLanguageRequired: "Required.",
      locationRequired: "Required.",
      disabilityRequired: "Required."
    }
  },

  nso: {
    fullNames: "Maina a feletseng",
    email: "Imeile",
    password: "Phasewete",
    confirmPassword: "Netefatsa Phasewete",
    contactDetails: "Dintlha tša kgokagano",
    phonePlaceholder: "78 *** ****",
    dob: "Letšatši la matswalo",
    sex: "Bong",
    male: "Monna",
    female: "Mosadi",
    ethnicity: "Setšhaba",
    african: "Moafrika",
    white: "Moušwa",
    coloured: "Motswakwa",
    indian: "Moindia",
    homeLanguage: "Polelo ya Gae",
    sepedi: "Sepedi",
    xitsonga: "Xitsonga",
    tshivenda: "Tshivenda",
    location: "Lefelo la bjale",
    hasLicense: "Ke na le laesense ya go sepela",
    hasDisability: "O phela le bokgoni bjo bo fokolago?",
    disabilityPlaceholder: "Hlalosa mo",
    select: "Kgetha",
    submit: "Romela",
    posting: "Go romela...",
    errors: {
      fullNamesRequired: "Hlokega. Kenya maina a feletseng.",
      fullNamesPattern: "Mangwalo le dikgapetšo feela. Bonyane ditlhaka tše 2.",
      emailRequired: "Hlokega. Kenya aterese ya imeile.",
      emailInvalid: "Sebopego se fošagetšego. Kenya aterese ya imeile ye nepagetšego.",
      passwordRequired: "Phasewete e a hlokega.",
      passwordPattern: "Bonyane ditlhaka tše 8, go akaretša ditlhaka tše dikgolo, tše nnyane, nomoro le sešupo.",
      confirmPasswordRequired: "Netefatso ya phasewete e a hlokega.",
      passwordMismatch: "Diphasewete ga di swane.",
      phoneRequired: "Hlokega. Kenya nomoro ya mogala.",
      phonePattern: "Sebopego se fošagetšego. Kenya nomoro ya mogala ya ditlhaka tše 9.",
      dobRequired: "Hlokega.",
      sexRequired: "Hlokega.",
      ethnicityRequired: "Hlokega.",
      homeLanguageRequired: "Hlokega.",
      locationRequired: "Hlokega.",
      disabilityRequired: "Hlokega."
    }
  },

  ts: {
    fullNames: "Mavito ya xikarhi",
    email: "Imeili",
    password: "Phasiwedi",
    confirmPassword: "Tiyisisa Phasiwedi",
    contactDetails: "Vuxokoxoko bya vuxavisi",
    phonePlaceholder: "78 *** ****",
    dob: "Siku ra ku velekiwa",
    sex: "Rimbewu",
    male: "Xivato",
    female: "Xisati",
    ethnicity: "Vuxaka",
    african: "MuAfrika",
    white: "Muhlovo",
    coloured: "MuTshangana",
    indian: "MuIndiya",
    homeLanguage: "Ririmi ra le kaya",
    sepedi: "Sepedi",
    xitsonga: "Xitsonga",
    tshivenda: "Tshivenda",
    location: "Ndhawu ya sweswi",
    hasLicense: "Ndzi na layisense ya ku famba",
    hasDisability: "Xana u hanya na vuvabyi byo karhi?",
    disabilityPlaceholder: "Komisa laha",
    select: "Hlawula",
    submit: "Tumela",
    posting: "Ku tumela...",
    errors: {
      fullNamesRequired: "Swi laveka. Hi kombela u nghenisa mavito ya wena.",
      fullNamesPattern: "Mavito ntsena. Mavito lama nga ehansi ka 2 a ma amukeleki.",
      emailRequired: "Swi laveka. Nghenisa imeili ya wena.",
      emailInvalid: "Fomati ya imeili a yi lulamanga.",
      passwordRequired: "Phasiwedi yi laveka.",
      passwordPattern: "Phasiwedi yi fanele ku va na 8+ timhaka, ku katsa tinyiko, tinomboro, na swifaniso.",
      confirmPasswordRequired: "Tiyisisa phasiwedi ya laveka.",
      passwordMismatch: "Tiphasiwedi a ti fambelani.",
      phoneRequired: "Swi laveka. Nghenisa nomboro ya sele.",
      phonePattern: "Fomati ya nomboro ya sele a yi lulamanga.",
      dobRequired: "Swi laveka.",
      sexRequired: "Swi laveka.",
      ethnicityRequired: "Swi laveka.",
      homeLanguageRequired: "Swi laveka.",
      locationRequired: "Swi laveka.",
      disabilityRequired: "Swi laveka."
    }
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
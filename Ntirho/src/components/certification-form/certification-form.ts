import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { Database } from '../../services/database';
import { AuthService } from '../../services/auth';
import { Certificate } from '../../interfaces';
import { OutletContext } from '@angular/router';
import { Language, LanguageService } from '../../services/language';

@Component({
  selector: 'app-certification-form',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './certification-form.html',
  styleUrl: './certification-form.css'
})
export class CertificateForm implements OnInit {
  form!: FormGroup;
  @Input() userId: string | null = "";

  // For the editor
  @Input() certificate: Certificate | null = null;
  @Output() closeEditor = false;
  id = 0;
  isEdit = false;

  // Language
  translations: any = {};
  currentLang: Language = 'en';

  constructor(private fb: FormBuilder, 
    private db: Database,
    private auth: AuthService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    // Language
    this.currentLang = this.languageService.getLanguage();
    this.languageService.language$.subscribe(x => {
      this.currentLang = x;
    })
    this.translations = translations;

    // Get user_id
    const user_id = this.auth.getUserId();

    if (this.certificate){
      this.isEdit = true;

      // Assign certificate id for update
      this.id = this.certificate.certificate_id;
    }

    this.form = this.fb.group({
      title: [this.certificate?.title, Validators.required],
      issuer: [this.certificate?.issuer, Validators.required],
      issue_date: [this.certificate?.issue_date],
      expiry_date: [this.certificate?.expiry_date],
      credential_url: [this.certificate?.credential_url],
      user_id: [user_id]
    });
  }

  isLoading = false;
  async onSubmit() {
    this.form.markAllAsTouched();

    if (this.form.invalid){     
      console.log('The form is invalid.');
      return;
    }

    this.isLoading = true;
    
    try {
      const results = !this.isEdit ? 
        await this.db.insertCertificate(this.form.value) : 
        await this.db.updateCertificate(this.form.value, this.id);
      if ( results.error ) {
        throw results.error;
      }

      // Alert the user
      if (!this.isEdit)
        alert('Your certificate has been successfully inserted.');
      else
        alert('Your certificate has been successfully updated.');
      
      // Clear form
      this.form.reset();

      // Update the UI
      this.isLoading = false;

      // Update popup
      this.closeEditor = true;
    } catch (error) {
      console.error('Error while posting a certificate.', error);
      this.isLoading = false;
    } finally {
      this.isLoading = false;
    }
  }
}

const translations = {
  en: {
    certificateForm: {
      titleLabel: "Title of the certificate",
      titlePlaceholder: "e.g. Relational Databases",
      issuerLabel: "Issuer or Organization",
      issuerPlaceholder: "e.g. freeCodeCamp.com",
      issueDateLabel: "Issue Date",
      expiryDateLabel: "Expiry Date",
      credentialUrlLabel: "Credential Url",
      credentialUrlPlaceholder: "e.g. https://google.com",
      save: "Save Certificate",
      saving: "Saving...",
      errors: {
        required: "Required.",
        invalidUrl: "Please enter a valid url."
      }
    }
  },
  nso: {
    certificateForm: {
      titleLabel: "Leina la Setifikeiti",
      titlePlaceholder: "mohl. Relational Databases",
      issuerLabel: "Mokgathi goba Mokgatlo",
      issuerPlaceholder: "mohl. freeCodeCamp.com",
      issueDateLabel: "Letšatši la go Ntšhwa",
      expiryDateLabel: "Letšatši la go Fela",
      credentialUrlLabel: "URL ya Setifikeiti",
      credentialUrlPlaceholder: "mohl. https://google.com",
      save: "Boloka Setifikeiti",
      saving: "E a bolokega...",
      errors: {
        required: "Ya hlokega.",
        invalidUrl: "Tsenya URL ye e nepagetšego."
      }
    }
  },
  ts: {
    certificateForm: {
      titleLabel: "Xivito xa Satifikheti",
      titlePlaceholder: "xik. Relational Databases",
      issuerLabel: "Muendli kumbe Nhlangano",
      issuerPlaceholder: "xik. freeCodeCamp.com",
      issueDateLabel: "Siku ro humesa",
      expiryDateLabel: "Siku ro hela",
      credentialUrlLabel: "URL ya Satifikheti",
      credentialUrlPlaceholder: "xik. https://google.com",
      save: "Hlayisa Satifikheti",
      saving: "Ku hlayisiwa...",
      errors: {
        required: "Ya laveka.",
        invalidUrl: "Nghenisa URL leyi lulameke."
      }
    }
  }
};
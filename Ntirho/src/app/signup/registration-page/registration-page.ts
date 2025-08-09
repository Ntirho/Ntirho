import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../../services/language';
import { RegistrationForm } from "../../../components/registration-form/registration-form";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registration-page',
  imports: [
    RegistrationForm,
    CommonModule
  ],
  templateUrl: './registration-page.html',
  styleUrl: './registration-page.css'
})
export class RegistrationPage implements OnInit {
  translations: any = {};

  constructor (private languageService: LanguageService) {}

  ngOnInit(): void {
      this.translations = this.languageService.translations;
  }
}

import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LanguageService } from '../../services/language';
import { LoginForm } from "../login-form/login-form";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  imports: [
    LoginForm, 
    RouterLink
  ],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class Hero implements OnInit {
  translations: any = {};
  
  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
    this.translations = this.languageService.translations;
  }
}

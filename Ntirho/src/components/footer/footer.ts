import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../services/language';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [
    RouterLink
  ],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {
  translations: any = {};
  currentYear = new Date().getFullYear();

  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
    this.translations = this.languageService.translations;
  }
}

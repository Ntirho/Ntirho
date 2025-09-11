import { Component, OnInit } from '@angular/core';
import { JobPostingForm } from '../../../components/job-posting-form/job-posting-form';
import { Language, LanguageService } from '../../../services/language';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-post-job',
  imports: [
    JobPostingForm
],
  templateUrl: './post-job.html',
  styleUrl: './post-job.css'
})
export class PostJob implements OnInit {
  translations: any = {};
  currentLang: Language = 'en';

  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
    // Set the language
    this.currentLang = this.languageService.getLanguage();
    this.languageService.language$.subscribe(x => {
      this.currentLang = x;
      this.translations = translations[this.currentLang];
    });
  }
}

const translations = {
  en: {
    postJobTitle: "Post a Job"
  },
  nso: {
    postJobTitle: "Romela Mošomo"
  },
  ts: {
    postJobTitle: "Tumela ntirho"
  }
};
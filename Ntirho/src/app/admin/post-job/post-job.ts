import { Component, OnInit } from '@angular/core';
import { JobPostingForm } from '../../../components/job-posting-form/job-posting-form';
import { LanguageService } from '../../../services/language';
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

  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
      this.translations = this.languageService.translations;
  }
}

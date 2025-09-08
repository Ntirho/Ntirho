import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { JobMatch, Job, dummyJobs } from '../../interfaces';
import { Modal } from '../modal/modal';
import { Database } from '../../services/database';
import { Language, LanguageService } from '../../services/language';
import { Translation } from '../../contexts/language-context';

@Component({
  selector: 'app-matched-job-card',
  imports: [
    CommonModule,
    Modal
  ],
  templateUrl: './matched-job-card.html',
  styleUrl: './matched-job-card.css'
})
export class MatchedJobCard implements OnChanges, OnInit{
  @Input() job!: JobMatch;
  temp_job!: Job;
  jobs: Job[] = [];

  currentLang: Language = 'en';
  translations: any = {};

  constructor(private db: Database, private languageService: LanguageService){}

  ngOnInit(): void {
    // Set the language
    this.currentLang = this.languageService.getLanguage();
    this.translations = translations; 

    // Set the jobs
    this.getJobs();   
  }
  ngOnChanges(changes: SimpleChanges): void {
      this.temp_job = this.jobs.find(x => x.job_id === this.job.job_id)!;
  }

  // Function to get data
  async getJobs(){
    await this.db.getJobs().then(({data, error}) => {
      if (error){
        console.error('Error while fetching jobs from matched-job-card.', error);
        return;
      }

      if (data){
        this.jobs = data;
      
        this.temp_job = this.jobs.find(x => x.job_id === this.job.job_id)!;  

        console.log('Jobs from matched card', this.jobs);
        console.log('Selected job', this.job);
      }
    })
  }

  // For display job info
  isModalOpen = false

  openModal(){
    this.isModalOpen = true;
  }
  closeModal(){
    this.isModalOpen = false;
  }
}

const translations = {
  en: {
    viewDetails: "View Details",
    matchScoreSuffix: "%"
  },
  nso: {
    viewDetails: "Bona dintlha",
    matchScoreSuffix: "%"
  },
  ts: {
    viewDetails: "Vona Vuxokoxoko",
    matchScoreSuffix: "%"
  }
};
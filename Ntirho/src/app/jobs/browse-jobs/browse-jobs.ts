import { Component, OnInit } from '@angular/core';
import { Job } from '../../../interfaces';
import { LanguageService } from '../../../services/language';
import { VoiceSearch } from "../../../components/voice-search/voice-search";
import { CommonModule } from '@angular/common';
import { JobCard } from "../../../components/job-card/job-card";
import { FormsModule } from '@angular/forms';
import { Database } from '../../../services/database';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-browse-jobs',
  imports: [
    VoiceSearch,
    CommonModule,
    JobCard,
    FormsModule
],
  templateUrl: './browse-jobs.html',
  styleUrl: './browse-jobs.css'
})
export class BrowseJobs implements OnInit {
  translations: any = {};
  locationFilter = '';
  skillFilter = 'all';
  skillsList = skillsList;
  jobs: Job[] = [];
  
  constructor(
    private languageService: LanguageService,
    private db: Database,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.translations = this.languageService.translations;

    // Get jobs
    this.getJobs();
  }

  async getJobs() {
    // Get the jobs
    await this.db.getJobs().then(({data, error}) => {
      if (error)
        console.error('Error while retrieving jobs.', error);
      else {
        this.jobs = data;

        // Detect changes for updates
        this.cdr.detectChanges();
        console.log(data);
      }
    });
  }

  get filteredJobs1(): Job[] {
    return this.jobs.filter(job =>
      (this.locationFilter === '' || job.location.includes(this.locationFilter)) &&
      (this.skillFilter === 'all' || job.skills.includes(this.skillFilter))
    );
  }

  get filteredJobs() {
  const query = this.locationFilter?.toLowerCase().trim() || '';
  const skill = this.skillFilter;

  return this.jobs.filter(job => {
    const matchesSearch =
      job.location.toLowerCase().includes(query) ||
      job.title.toLowerCase().includes(query);

    const matchesSkill =
      skill === 'all' || job.skills.includes(skill);

    return matchesSearch && matchesSkill;
  });
}


  handleVoiceSearch(query: string) {
    this.locationFilter = query;
  }

  clearFilters() {
    this.locationFilter = '';
    this.skillFilter = 'all';
  }
}

const skillsList = [
    { label: "Construction", value: "construction" },
    { label: "Farming", value: "farming" },
    { label: "Retail", value: "retail" },
    { label: "Hospitality", value: "hospitality" },
    { label: "Driving", value: "driving" },
    { label: "Domestic Work", value: "domestic_work" },
    { label: "Other", value: "other" },
];
import { Component, OnInit } from '@angular/core';
import { Job } from '../../../interfaces';
import { Language, LanguageService } from '../../../services/language';
import { VoiceSearch } from "../../../components/voice-search/voice-search";
import { CommonModule } from '@angular/common';
import { JobCard } from "../../../components/job-card/job-card";
import { FormsModule } from '@angular/forms';
import { Database } from '../../../services/database';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { SepediASR } from '../../../services/sepedi-asr';

@Component({
  selector: 'app-browse-jobs',
  imports: [
    VoiceSearch,
    CommonModule,
    JobCard,
    FormsModule,
    HttpClientModule
],
  templateUrl: './browse-jobs.html',
  styleUrl: './browse-jobs.css',
  providers: [
    SepediASR
  ]
})
export class BrowseJobs implements OnInit {
  translations: any = {};
  currentLang: Language = 'en'
  locationFilter = '';
  skillFilter = 'all';
  skillsList = skillsList;
  jobs: Job[] = [];
  voiceInputSkills: string[] = [];
  filterList: string[] = [];
  
  constructor(
    private languageService: LanguageService,
    private db: Database,
    public cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Set language
    this.currentLang = this.languageService.getLanguage();
    this.languageService.language$.subscribe(x => {
      this.currentLang = x;
      this.translations = translations[this.currentLang];
    })

    // Get jobs
    this.getJobs();
  }

  // Get skills from voice record
  handleVoiceSkills(skills: string) {
    const tempSkills = skills.split(',').map(s => s.trim() && s.toLowerCase());
    this.voiceInputSkills = tempSkills;
    console.log('Skills from voice: ', skills);

    // Assign the skills to 
    tempSkills.forEach(skill => {
      // Add each skill if is not on the list
      if (!this.filterList.includes(skill)){
        this.addFilterOptions(skill);

        // Check
        console.log('JObs filtered: ', this.filteredJobs);

        // Notify the UI
        this.cdr.markForCheck();
      }
      
    });
  }

  async getJobs() {
    // Get the jobs
    await this.db.getJobs().then(({data, error}) => {
      if (error)
        console.error('Error while retrieving jobs.', error);
      else {
        this.jobs = data;

        // Detect changes for updates
        this.cdr.markForCheck();
        console.log(data);
      }
    });
  }

  get filteredJobs(): Job[] {
  const query = this.locationFilter?.toLowerCase().trim() || '';
  const activeSkills = this.filterList || [];

  return this.jobs.filter(job => {
    const matchesSearch =
      job.location.toLowerCase().includes(query) ||
      job.title.toLowerCase().includes(query);

    const matchesSkills =
      activeSkills.length === 0 || activeSkills.some(skill =>
        job.skills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
      );

    return matchesSearch && matchesSkills;
  });
}


  // Filter option add
  addFilterOptions(option: string) {
    if(option) {
      console.log(`Adding ${option} to filter list`);
      if(!this.filterList.includes(option.trim().toLowerCase()))
        this.filterList = [...this.filterList, option.trim().toLowerCase()];

      // Alert the UI
      this.cdr.markForCheck();
    }
  }

  // Filter option remove 
  removeFilterOption(option: string) {
    if(option) {
      console.log(`Removing ${option}`);
      this.filterList = this.filterList.filter(x => x !== option);
    }
  }


  handleVoiceSearch(query: string) {
    this.locationFilter = query;
  }

  clearFilters() {
    this.locationFilter = '';
    this.skillFilter = 'all';
    this.filterList = [];
  }
}

const translations = {
  en: {
    browseJobsTitle: "Browse Jobs",
    browseJobsSubtitle: "Use filters or voice search to find opportunities that match your skills.",
    locationLabel: "Location",
    locationPlaceholder: "e.g. Polokwane, Johannesburg",
    skillsLabel: "Skills",
    allSkills: "All Skills",
    clearFilters: "Clear Filters",
    noJobsFoundTitle: "No jobs found",
    noJobsFoundSubtitle: "Try adjusting your filters or updating your profile."
  },
  nso: {
    browseJobsTitle: "Batla Mešomo",
    browseJobsSubtitle: "Diriša difilthara goba patlo ka lentswe go hwetša menyetla yeo e swanetšego le bokgoni bja gago.",
    locationLabel: "Lefelo",
    locationPlaceholder: "mohl. Polokwane, Johannesburg",
    skillsLabel: "Bokgoni",
    allSkills: "Bokgoni ka moka",
    clearFilters: "Hlwekiša Difilthara",
    noJobsFoundTitle: "Ga go na mešomo yeo e hweditšwego",
    noJobsFoundSubtitle: "Leka go fetola difilthara goba ntšha profaele ya gago."
  },
  ts: {
    browseJobsTitle: "Languta Mintirho",
    browseJobsSubtitle: "Tirhisa tifilithara kumbe ku lava hi rito ku kuma mintirho leyi fambelanaka na vutivi bya wena.",
    locationLabel: "Ndhawu",
    locationPlaceholder: "xik. Polokwane, Johannesburg",
    skillsLabel: "Vutivi",
    allSkills: "Vutivi hinkwabyo",
    clearFilters: "Sula Tifilithara",
    noJobsFoundTitle: "A ku na mintirho leyi kumekaka",
    noJobsFoundSubtitle: "Lungisa tifilithara kumbe profaele ya wena."
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
];
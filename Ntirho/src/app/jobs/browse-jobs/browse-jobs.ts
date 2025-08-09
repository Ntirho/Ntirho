import { Component } from '@angular/core';
import { Job } from '../../../interfaces';
import { LanguageService } from '../../../services/language';
import { VoiceSearch } from "../../../components/voice-search/voice-search";
import { CommonModule } from '@angular/common';
import { JobCard } from "../../../components/job-card/job-card";
import { FormsModule } from '@angular/forms';

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
export class BrowseJobs {
  translations: any = {};
  locationFilter = '';
  skillFilter = 'all';
  skillsList = skillsList;
  jobs = dummyJobs;
  
  constructor(
    private languageService: LanguageService,
  ) {}

  ngOnInit() {
    this.translations = this.languageService.translations;
  }

  get filteredJobs(): Job[] {
    return this.jobs.filter(job =>
      (this.locationFilter === '' || job.location.includes(this.locationFilter)) &&
      (this.skillFilter === 'all' || job.skills.includes(this.skillFilter))
    );
  }

  handleVoiceSearch(query: string) {
    this.locationFilter = query;
  }

  clearFilters() {
    this.locationFilter = '';
    this.skillFilter = 'all';
  }
}

const dummyJobs: Job[] = [
  {
    job_id: 1,
    title: 'General Worker',
    company: 'BuildIt Polokwane',
    location: 'Polokwane',
    skills: ['construction', 'retail'],
    description: 'Looking for a general worker to assist with various tasks at our hardware store. Responsibilities include stocking shelves, assisting customers, and maintaining a clean work environment.'
  },
  {
    job_id: 2,
    title: 'Farm Hand',
    company: 'Zebediela Citrus Estate',
    location: 'Zebediela',
    skills: ['farming'],
    description: 'Seeking a dedicated farm hand for our citrus estate. Duties involve irrigation, pest control, and harvesting. Experience with farm machinery is a plus.'
  },
  {
    job_id: 3,
    title: 'Cashier',
    company: 'Shoprite Mankweng',
    location: 'Mankweng',
    skills: ['retail'],
    description: 'Friendly and reliable cashier needed for a busy supermarket. Must be good with numbers and have excellent customer service skills.'
  },
  {
    job_id: 4,
    title: 'Hotel Cleaner',
    company: 'Sun Meropa',
    location: 'Polokwane',
    skills: ['hospitality', 'domestic_work'],
    description: 'We are hiring a cleaner to maintain the high standards of our hotel rooms and public areas. Attention to detail is a must.'
  },
  {
    job_id: 5,
    title: 'Delivery Driver',
    company: 'FastFlow Couriers',
    location: 'Polokwane',
    skills: ['driving'],
    description: 'Experienced driver with a valid license needed for local deliveries. Must have a good knowledge of the Polokwane area.'
  },
    {
    job_id: 6,
    title: 'Gardener',
    company: 'Jane Furse Gardens',
    location: 'Jane Furse',
    skills: ['farming', 'other'],
    description: 'Passionate gardener required to maintain several private gardens. Knowledge of local plants and landscaping is essential.'
  },
  {
    job_id: 7,
    title: 'Waiter/Waitress',
    company: 'The Eatery',
    location: 'Mankweng',
    skills: ['hospitality'],
    description: 'Energetic waiting staff needed for a popular restaurant. Must be a team player with a positive attitude.'
  },
  {
    job_id: 8,
    title: 'Security Guard',
    company: 'SafeGuard Security',
    location: 'Zebediela',
    skills: ['other'],
    description: 'Vigilant security guard required for night shifts. PSIRA registration is mandatory.'
  }
];

const skillsList = [
    { label: "Construction", value: "construction" },
    { label: "Farming", value: "farming" },
    { label: "Retail", value: "retail" },
    { label: "Hospitality", value: "hospitality" },
    { label: "Driving", value: "driving" },
    { label: "Domestic Work", value: "domestic_work" },
    { label: "Other", value: "other" },
];
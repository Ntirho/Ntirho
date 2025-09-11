import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Certificate, Experience, Job, JobMatchesInput, JobMatchesOutput, UserAttributes } from '../../../interfaces';
import { JobMatching } from '../../../services/job-matching';
import { CommonModule } from '@angular/common';
import { MatchedJobCard } from '../../../components/matched-job-card/matched-job-card';
import { GenaiService } from '../../../services/genai';
import { AuthService } from '../../../services/auth';
import { Database } from '../../../services/database';
import { match } from 'assert';
import { Language, LanguageService } from '../../../services/language';

@Component({
  selector: 'app-browse-matched-jobs',
  imports: [
    CommonModule,
    MatchedJobCard
  ],
  templateUrl: './browse-matched-jobs.html',
  styleUrl: './browse-matched-jobs.css'
})
export class BrowseMatchedJobs implements OnInit {
  matches: JobMatchesOutput | null = null;
  isLoading = false;
  hasElements = false;
  error: string | null = null;
  user_id!: string;
  jobs: Job[] = [];
  experiences: Experience[] = [];
  certificates: Certificate[] = [];
  user_attributes: UserAttributes | null = null; 

  // Language 
  currentLang: Language = 'en';
  translations: any = {};

  constructor(
    private jobMatchService: JobMatching,
    private genai: GenaiService,
    private auth: AuthService,
    private db: Database,
    private cdr: ChangeDetectorRef,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    // Set language
    this.currentLang = this.languageService.getLanguage();
    this.languageService.language$.subscribe(x => {
      this.currentLang = x;
    })
    this.translations = translations;

    // this.fetchMatches();

    // Testing the gen-AI model
    //this.genai.Tester();

    // Initialize the matches
    this.matches = { matches: []}

    // Get current user_id
    this.user_id = this.auth.getUserId() ?? '';

    // Get matches
    this.getMatches();
  }

  // Service
  async getMatches() {
    // Alert the user
    this.isLoading = true;
    this.error = null;

    if(this.user_id){
      // Get user attributes
      await this.db.getUserAttributes(this.user_id).then(({data, error}) => {
        if(data) {
          this.user_attributes = data;
        }
      });

      // Get jobs
      await this.db.getJobs().then(({data, error}) => {
        if(data) {
          this.jobs = data;
        }
      });

      // Get experiences
      await this.db.getExperiences(this.user_id).then((data) => {
        if(data) {
          this.experiences = data;
        }
      });

      // Get certificates
      await this.db.getCertificates(this.user_id).then((data) => {
        if(data) {
          this.certificates = data;
        }
      });

      if (this.jobs && this.user_attributes){
        // Create the prompt
        const prompt = this.genai.promptBuilder(this.jobs, this.user_attributes, this.experiences, this.certificates);

        // Get resonse
        const response = await this.genai.JobMatcher(prompt).then(data => {
          if (data.text){
            // Assign them to the jobs
            try {
              const raw = data.text.trim();
              const cleaned = raw.replace(/^```json|```$/g, '').trim();
              const parsed = JSON.parse(cleaned);
              
              this.matches = { matches: parsed };

              // Filter the jobs
              this.matches.matches = this.matches.matches.filter(x => x.matchScore > 0);

              // Stop loading
              this.isLoading = false;
              this.cdr.detectChanges();

              // Check
              console.log(this.matches);
            } catch (err) {
              console.error('Failed to parse job matches:', err);
              this.isLoading = false;
            } finally {
              this.isLoading = false;
            }
          }
          else
            console.warn('No data received from AI');

            // Stop loading
            this.isLoading = false;
        });
      }
    } else {
        // Stop loading
        this.error = 'No user id';
        this.isLoading = false;
    }
  }

  fetchMatches(): void {
    this.isLoading = true;
    this.error = null;

    const userProfile: JobMatchesInput = {
      skills: ['plumbing', 'bricklaying'],
      preferences: ['Location: Polokwane']
    };

    this.jobMatchService.getJobMatches(userProfile).subscribe({
      next: (result) => {
        this.matches = result;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message || 'An unexpected error occurred. Please try again later.';
        this.isLoading = false;
      }
    });

    // Get current user_id

  }
}

const translations = {
  en: {
    jobMatchesTitle: "Your Job Matches",
    welcomeMessage: "Welcome back! Here are your latest matches.",
    loadingMessage: "Finding jobs for you...",
    errorTitle: "Oops! Something went wrong",
    tryAgain: "Try Again",
    noMatchesTitle: "No matches found",
    noMatchesMessage: "Try updating your profile or preferences."
  },
  nso: {
    jobMatchesTitle: "Mešomo yeo e Sepedišwago le Wena",
    welcomeMessage: "Re a go amogela gape! Mešomo yeo e swanetšego le wena ke ye.",
    loadingMessage: "Re nyaka mešomo yeo e swanetšego le wena...",
    errorTitle: "Aowa! Go na le bothata",
    tryAgain: "Leka Gape",
    noMatchesTitle: "Ga go na mešomo yeo e swanetšego",
    noMatchesMessage: "Leka go ntšha profaele goba diphetho tša gago."
  },
  ts: {
    jobMatchesTitle: "Mintirho leyi fambelanaka na wena",
    welcomeMessage: "U amukeriwile nakambe! Hi vona mintirho leyi fambelanaka na wena.",
    loadingMessage: "Hi lava mintirho ya wena...",
    errorTitle: "Eish! Ku na ni xihoxo",
    tryAgain: "Lava nakambe",
    noMatchesTitle: "A ku na mintirho leyi fambelanaka",
    noMatchesMessage: "Lungisa profaele ya wena kumbe swilaveko swa wena."
  }
};
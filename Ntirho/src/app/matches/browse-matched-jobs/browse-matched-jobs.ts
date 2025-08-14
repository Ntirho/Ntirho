import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Job, JobMatchesInput, JobMatchesOutput, UserAttributes } from '../../../interfaces';
import { JobMatching } from '../../../services/job-matching';
import { CommonModule } from '@angular/common';
import { MatchedJobCard } from '../../../components/matched-job-card/matched-job-card';
import { GenaiService } from '../../../services/genai';
import { AuthService } from '../../../services/auth';
import { Database } from '../../../services/database';
import { match } from 'assert';

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
  user_attributes: UserAttributes | null = null; 

  constructor(
    private jobMatchService: JobMatching,
    private genai: GenaiService,
    private auth: AuthService,
    private db: Database,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
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
      await this.db.getUserAttributes(this.user_id).then(({data, error}) => {
        if(data) {
          this.user_attributes = data;
        }
      });

      await this.db.getJobs().then(({data, error}) => {
        if(data) {
          this.jobs = data;
        }
      });

      if (this.jobs && this.user_attributes){
        // Create the prompt
        const prompt = this.genai.promptBuilder(this.jobs, this.user_attributes);

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

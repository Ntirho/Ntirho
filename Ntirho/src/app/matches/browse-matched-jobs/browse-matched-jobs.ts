import { Component, OnInit } from '@angular/core';
import { JobMatchesInput, JobMatchesOutput } from '../../../interfaces';
import { JobMatching } from '../../../services/job-matching';
import { CommonModule } from '@angular/common';
import { MatchedJobCard } from '../../../components/matched-job-card/matched-job-card';

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
  isLoading = true;
  error: string | null = null;

  constructor(private jobMatchService: JobMatching) {}

  ngOnInit(): void {
    this.fetchMatches();
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
  }
}

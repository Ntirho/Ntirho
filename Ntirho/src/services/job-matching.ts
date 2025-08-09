// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class JobMatching {
  
// }
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { dummyJobMatches, JobMatch, JobMatchesInput, JobMatchesOutput } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class JobMatching {
  private sampleJobs: JobMatch[] = dummyJobMatches;

  constructor() {}

  getJobMatches(input: JobMatchesInput): Observable<JobMatchesOutput> {
    const matches = this.sampleJobs
      .map(job => {
        const matchedSkills = job.matchedSkills.filter(skill =>
          input.skills.includes(skill)
        );
        const locationMatch = input.preferences.includes(job.location);
        const scoreBoost = locationMatch ? 10 : 0;

        return {
          ...job,
          matchScore: job.matchScore + scoreBoost,
          matchedSkills
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);

    return of({ matches }).pipe(delay(500)); // Simulate async response
  }
}

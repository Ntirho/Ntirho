import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { JobMatch, Job, dummyJobs } from '../../interfaces';
import { Modal } from '../modal/modal';
import { Database } from '../../services/database';

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

  constructor(private db: Database){}

  ngOnInit(): void {
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

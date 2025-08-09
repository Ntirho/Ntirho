import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { JobMatch, Job, dummyJobs } from '../../interfaces';
import { Modal } from '../modal/modal';

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
  jobs = dummyJobs;

  ngOnInit(): void {
      this.temp_job = this.jobs.find(x => x.job_id === this.job.job_id)!;      
  }
  ngOnChanges(changes: SimpleChanges): void {
      this.temp_job = this.jobs.find(x => x.job_id === this.job.job_id)!;
  }

  isModalOpen = false

  openModal(){
    this.isModalOpen = true;
  }
  closeModal(){
    this.isModalOpen = false;
  }
}

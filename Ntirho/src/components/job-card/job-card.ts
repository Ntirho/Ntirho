import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language';
import { Job } from '../../interfaces';
import { RouterLink } from '@angular/router';
import { Modal } from "../modal/modal";

@Component({
  selector: 'app-job-card',
  imports: [
    CommonModule,
    Modal
],
  templateUrl: './job-card.html',
  styleUrl: './job-card.css'
})
export class JobCard {
  @Input() job!: Job;
  translations: any = {};

  constructor(
    //private toast: ToastService,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    this.translations = this.languageService.translations
  }

  // Viewing the job details
  isOpenModal = false;

  openModal(){
    this.isOpenModal = true;
  }
  closeModal(){
    this.isOpenModal = false;
  }

  handleApply() {
    // this.toast.show(
    //   this.translations.applicationSentTitle,
    //   `${this.translations.applicationSentDesc} ${this.job.title}`,
    //   'success'
    // );
  }
}

import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Job } from '../../interfaces';
import { LanguageService } from '../../services/language';

@Component({
  selector: 'app-modal',
  imports: [
    CommonModule
  ],
  templateUrl: './modal.html',
  styleUrl: './modal.css'
})
export class Modal {
  @Input() openModal = false;
  @Input() job!: Job;
  @Output() close = new EventEmitter<void>();

  translations : any = {};

  constructor(private languageService: LanguageService){
    this.translations = languageService.translations;
  }

  onClose(){
    this.close.emit();
  }

  // Function for application
  handleApply() {

  }
}

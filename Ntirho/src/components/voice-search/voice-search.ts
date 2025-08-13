import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, OnInit, Output } from '@angular/core';
import { LanguageService } from '../../services/language';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-voice-search',
  imports: [
    CommonModule
],
  templateUrl: './voice-search.html',
  styleUrl: './voice-search.css',
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})

export class VoiceSearch {
  @Output() search = new EventEmitter<string>();

  isRecording = false;
  transcription = '';
  translation = '';
  error: string | null = null;
  translations: any = {};

  constructor(
    // private toast: ToastService,
    private languageService: LanguageService
  ) {}

  ngOnInit(){
    this.translations = this.languageService.translations;
  }

  async handleMicClick() {
    this.isRecording = true;
    this.error = null;
    this.transcription = '';
    this.translation = '';

    //this.toast.show(this.translations.voiceSearchListening, this.translations.voiceSearchSpeakNow, 'info');

    await new Promise(resolve => setTimeout(resolve, 3000));

    const mockAudioDataUri = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';

    try {
      // Simulated response
      const mockResult = {
        transcription: 'Nna ke nyaka mošomo wa go aga',
        translation: 'I am looking for a construction job'
      };

      this.transcription = mockResult.transcription;
      this.translation = mockResult.translation;
      this.search.emit(mockResult.translation);

      //this.toast.show(this.translations.voiceSearchComplete, this.translations.voiceSearchProcessed, 'success');
    } catch (err: any) {
      this.error = err.message || 'An unknown error occurred.';
      //this.toast.show(this.translations.voiceSearchFailed, this.translations.voiceSearchFailedDesc, 'error');
    } finally {
      this.isRecording = false;
    }
  }
}

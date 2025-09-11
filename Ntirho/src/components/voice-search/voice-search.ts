import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, OnInit, Output } from '@angular/core';
import { Language, LanguageService } from '../../services/language';
import { CommonModule } from '@angular/common';
import { WebkitASR } from '../../services/webkit-asr';
import { SepediASR } from '../../services/sepedi-asr';
import { GenaiService } from '../../services/genai';

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
  @Output() skills = new EventEmitter<string>();

  isRecording = false;
  transcription = '';
  translation = '';
  error: string | null = null;

  // Language
  translations: any = {};
  currentLang: Language = 'en';

  recognition: any;
  transcript: string = '';

  // Transcibe process
  isTranscribing = false;

  constructor(
    private languageService: LanguageService, 
    public voiceRecognitionService: WebkitASR,
    private sepediVoiceService: SepediASR,
    private cdr: ChangeDetectorRef,
    private genai: GenaiService
  ) {
    
  }

  ngOnInit(){
    // Set the language
    this.currentLang = this.languageService.getLanguage();
    this.languageService.language$.subscribe(x => {
      this.currentLang = x;
      this.translations = translations[this.currentLang];
    })

    // Initiate the engilsh voice recog service
    this.voiceRecognitionService.init();

    // Subscribe to sepediTranscriptionSubject
    this.sepediVoiceService.transcription.subscribe(x => {
      // Update the message
      this.message = x;
      this.transcript = x;    // Defined on the UI
      this.transcription = x;
      this.translation = x;

      this.isTranscribing = !this.isTranscribing;

      // Translation 
      this.sepediTranslator(x);

      // Get skill
      this.sepediGetSkills(this.translation); 

      // Alert the UI
      this.cdr.detectChanges();
    })
  }

  message: string = '';

  startRecording() {
    this.isRecording = !this.isRecording;
    this.error = null;

    // Choose the language
    switch(this.currentLang) {
      case 'ts': 
        this.tsongaStart();
        break;

      case 'nso': 
        this.sepediStart();
        break;

      default: 
        this.englishStart();
    }
  }

  stopRecording() {
    this.isRecording = !this.isRecording;
    this.isTranscribing = !this.isTranscribing;
    this.error = null;

    // Choose the language
    switch(this.currentLang) {
      case 'ts': 
        this.tsongaStop();
        break;

      case 'nso': 
        this.sepediStop();
        break;

      default: 
        this.englishStop();
    }
  }

  submitMessage(event: Event) {
    // Handle message submission logic here
    console.log('Message submitted:', this.message);
    this.message = ''; // Clear the input after submission
  }

  // Sepedi functions
  sepediStart() {
    this.sepediVoiceService.startRecording();
  }
  sepediStop() {
    this.sepediVoiceService.stopRecording();
  }

  // English functions
  englishStart() {
    // Start speech recog
    this.voiceRecognitionService.start();
  }
  englishStop() {
    // Stop speech recog
    this.voiceRecognitionService.stop();
    this.message = this.voiceRecognitionService.text;
    this.transcript = this.message;
    this.voiceRecognitionService.text = ''; // Clear the recognized text after appending to message

    // Pass the values
    this.transcription = this.message;
    this.translation = this.message;

    this.isTranscribing = !this.isTranscribing;

    // Get skills
    this.genai.extractEnglishSkills(this.transcription).then(skills => {
      console.log('Skills: ', skills.text);

      if (skills.text) {
        // Assign the skills
        this.skills.emit(skills.text);
      }
    });
    
    console.log('Submitted input: ', this.message);
  }

  // Tsonga function
  tsongaStart() {

  }
  tsongaStop() {

  }

  // Tanslation
  async sepediTranslator(transcript: string){
    // Translation 
      const prompt = this.genai.sepediToEnglishPromptBuilder(transcript);
      
      await this.genai.sepediTranslation(prompt).then(translation => {
        if (translation.text){
          this.translation = translation.text;
        }
      })
  }

  // Get skill
  async sepediGetSkills(transcript: string) {
    await this.genai.extractSepediSkills(transcript).then(skills => {
      //Check
      console.log('Skills: ', skills.text); 
      if(skills.text) {
        this.skills.emit(skills.text);
      }
    })
  }
}

const translations = {
  en: {
    voiceSearchTitle: "Voice Search",
    voiceSearchDescription: "Tap the microphone to speak.", 
    youSaidSepedi: "You said (Sepedi)",
    weUnderstoodEnglish: "We understood (English)"
  },
  nso: {
    voiceSearchTitle: "Patlo ka Lentswe",
    voiceSearchDescription: "Tobetsa maekrofouno go bolela ka Sepedi. Re tla ngwala le go fetolela go Seisimane.",
    youSaidSepedi: "O boletše (Sepedi)",
    weUnderstoodEnglish: "Re kwele (Seisimane)"
  },
  ts: {
    voiceSearchTitle: "Ku Lava hi Rito",
    voiceSearchDescription: "Tshinya maekrofoni u vulavula hi Xitsonga. Hi ta tsala ni ku hundzuluxela hi Xinghezi.",
    youSaidSepedi: "U vule (Xitsonga)",
    weUnderstoodEnglish: "Hi twile (Xinghezi)"
  }
};

/**
 * 
 * async startListening() {
    this.isRecording = true;
    this.error = null;
    this.transcription = '';
    this.translation = '';

    //this.toast.show(this.translations.voiceSearchListening, this.translations.voiceSearchSpeakNow, 'info');

    //await new Promise(resolve => setTimeout(resolve, 3000));

    //const mockAudioDataUri = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';

    try {
      this.recognition.start();

      this.search.emit(this.transcript);

      //this.toast.show(this.translations.voiceSearchComplete, this.translations.voiceSearchProcessed, 'success');
    } catch (err: any) {
      this.error = err.message || 'An unknown error occurred.';
      //this.toast.show(this.translations.voiceSearchFailed, this.translations.voiceSearchFailedDesc, 'error');
    } finally {
      this.isRecording = false;
    }
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
 * 
 * message: string = '';

  constructor(public voiceRecognitionService: VoiceRecognitionService) {}

  ngOnInit() {
    this.voiceRecognitionService.init();
  }

  startRecording() {
    this.voiceRecognitionService.start();
  }

  stopRecording() {
    this.voiceRecognitionService.stop();
    this.message += this.voiceRecognitionService.text;
    this.voiceRecognitionService.text = ''; // Clear the recognized text after appending to message
  }

  submitMessage(event: Event) {
    // Handle message submission logic here
    console.log('Message submitted:', this.message);
    this.message = ''; // Clear the input after submission
  }
 */
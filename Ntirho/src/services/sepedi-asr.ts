import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SepediASR {
  private apiUrl = 'http://localhost:8000/transcribe_2'; // Change to your backend URL
  private mediaRecorder!: MediaRecorder;
  private audioChunks: Blob[] = [];
  transcriptionSubject = new Subject<string>();
  transcription = this.transcriptionSubject.asObservable();
  res: any;

  constructor(private http: HttpClient) {}

  // StartRecording
  startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        this.transcribeAudio(audioBlob).subscribe(res => {
            console.log('Response:', res.transcription);
            this.res = res;
            
            // Update
            this.transcriptionSubject.next(res.transcription);
          });
      };

      this.mediaRecorder.start();
    });
  }

  // Stop recorder
  stopRecording() {
    this.mediaRecorder.stop();
    console.log("On stop", this.res)
  }

  // Transcriber
  transcribeAudio(blob: Blob): Observable<any> {
    const formData = new FormData();
    formData.append('file', blob, 'audio.wav');
    return this.http.post<any>(this.apiUrl, formData);
  }  

  /**
   * this.transcribeAudio(audioBlob).subscribe({
  next: res => {
    console.log('Response:', res);
    this.transcription = res.transcription;
  },
  error: err => {
    console.error('Transcription error:', err);
  }
});

   */
}

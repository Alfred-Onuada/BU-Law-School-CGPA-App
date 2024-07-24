import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../header/header.component";
import { TranscriptService } from '../services/transcript.service';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { IGPASummary, IStudentGrade, IStudentTranscript } from '../interfaces/student-info-transcript';

@Component({
  selector: 'app-transcript',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './transcript.component.html',
  styleUrls: ['./transcript.component.css']
})
export class TranscriptComponent {
  showError = false;
  errorMessage = '';
  transcriptLoading = true;
  transcriptSub$!: Subscription;
  studentId!: string;
  studentInfo!: IStudentTranscript;
  grades!: IStudentGrade[];
  gpaSummary!: IGPASummary;
  sessions: string[] = [];

  @ViewChild('transcript') transcriptBody!: ElementRef;

  constructor(
    private titleService: Title,
    private transcriptService: TranscriptService,
    private router: Router
  ) {
    this.titleService.setTitle("Transcript - Babcock University School of Law and Security Studies");
    this.studentId = this.router.parseUrl(this.router.url).queryParams['studentId'];

    this.transcriptSub$ = this.transcriptService.fetchTranscript(this.studentId).subscribe({
      next: (response) => {
        this.studentInfo = response.studentInfo;
        this.grades = response.grades;
        this.gpaSummary = response.gpaSummary;
        this.sessions = Object.keys(this.gpaSummary);

        this.transcriptLoading = false;
      },
      error: (error) => {
        console.error(error);

        this.showError = true;
        this.errorMessage = error.error.message;

        setTimeout(() => {
          this.showError = false;
          this.errorMessage = '';
          this.transcriptLoading = false;
        }, 3000);
      },
      complete: () => {
        this.transcriptSub$.unsubscribe();
      }
    })
  }

  exportTranscript() {
    if (!this.transcriptBody) {
      this.transcriptLoading = true;
      this.showError = true;
      this.errorMessage = 'Transcript not loaded. Please try again.';

      setTimeout(() => {
        this.transcriptLoading = false;
        this.showError = false;
        this.errorMessage = '';
      }, 3000);
    }

    const contentsToPrint = this.transcriptBody.nativeElement.innerHTML;
    const originalBody = document.body.innerHTML;

    document.body.innerHTML = contentsToPrint;
    window.print();
    document.body.innerHTML = originalBody;
    location.reload();
  }
}

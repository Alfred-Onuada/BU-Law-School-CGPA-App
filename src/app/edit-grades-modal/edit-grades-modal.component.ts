import { Component, AfterViewInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GradesService } from '../services/grades.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-grades-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-grades-modal.component.html',
  styleUrls: ['./edit-grades-modal.component.css']
})
export class EditGradesModalComponent {
  form: FormGroup;

  loading = false;
  showSuccess = false;
  showError = false;
  successMessage = '';
  errorMessage = '';

  courseId!: string; // pass in from modal
  score!: string; // pass in from modal
  courseName!: string; // pass in from modal

  studentId!: string;
  sessionId!: string;
  studentLevel!: string;
  semesterId!: string;

  gradeServiceSub$!: Subscription;
  
  constructor(
    public dialogRef: MatDialogRef<EditGradesModalComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: { courseId: string, score: string, courseName: string },
    private gradeService: GradesService
  ) {
    this.courseId = data.courseId;
    this.score = data.score;
    this.courseName = data.courseName;

    this.form = new FormGroup({
      newScore: new FormControl(0, [Validators.required, Validators.max(100), Validators.min(0)]),
    });

    // fetch data from url
    this.studentId = this.router.parseUrl(this.router.url).queryParams['studentId'];
    this.sessionId = this.router.parseUrl(this.router.url).queryParams['sessionId'];
    this.studentLevel = this.router.parseUrl(this.router.url).queryParams['level'];
    this.semesterId = this.router.parseUrl(this.router.url).queryParams['semesterId'];
  }

  closeModal() {
    this.dialogRef.close();
  }

  handleSubmit() {
    if (this.form.invalid) {
      this.showError = true;
      this.errorMessage = 'Please enter a valid score';

      setTimeout(() => {
        this.showError = false;
        this.errorMessage = '';
      }, 3000);

      return;
    }

    if (!this.studentId || !this.sessionId || !this.studentLevel || !this.semesterId || !this.courseId) {
      this.showError = true;
      this.errorMessage = 'An error occurred. Please try again';

      setTimeout(() => {
        this.showError = false;
        this.errorMessage = '';
      }, 3000);

      return;
    }

    this.loading = true;

    this.gradeServiceSub$ = this.gradeService.saveGrade(
      this.form.value.newScore,
      this.studentId,
      this.courseId,
      +this.studentLevel,
      this.semesterId,
      this.sessionId,
    ).subscribe({
      next: () => {
        this.loading = false;
        this.showSuccess = true;
        this.successMessage = 'Grade saved successfully';

        setTimeout(() => {
          this.showSuccess = false;
          this.successMessage = '';
          this.closeModal();
        }, 3000);
      },
      error: (error) => {
        this.loading = false;
        this.showError = true;
        this.errorMessage = error.message;

        setTimeout(() => {
          this.showError = false;
          this.errorMessage = '';
        }, 3000);
      }
    });
  }
}

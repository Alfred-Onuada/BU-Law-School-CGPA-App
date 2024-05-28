import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SessionService } from '../services/session.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ISession } from '../interfaces/session';

@Component({
  selector: 'app-add-session-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-session-modal.component.html',
  styleUrls: ['./add-session-modal.component.css']
})
export class AddSessionModalComponent {
  form: FormGroup;
  showError = false;
  errorMessage = '';
  showSuccess = false;
  successMessage = '';

  createdSessions: ISession[] = [];

  // loop through from current year to current year - 30
  years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);
  
  constructor(
    public dialogRef: MatDialogRef<AddSessionModalComponent>,
    private sessionService: SessionService
  ) {
    this.form = new FormGroup({
      startYear: new FormControl(this.years[1], Validators.required),
      endYear: new FormControl(this.years[0], Validators.required),
    });
  }

  closeModal() {
    this.dialogRef.close(this.createdSessions);
  }

  handleSubmit() {
    if (!this.form.valid) {
      this.showError = true;
      this.errorMessage = 'Please fill in all fields correctly';

      setTimeout(() => {
        this.showError = false;
        this.errorMessage = '';
      }, 3000);
      return;
    }

    if (this.form.value.startYear >= this.form.value.endYear) {
      this.showError = true;
      this.errorMessage = 'End year must be greater than start year';

      setTimeout(() => {
        this.showError = false;
        this.errorMessage = '';
      }, 3000);
      return;
    }

    // must be 1 year difference
    if (this.form.value.endYear - this.form.value.startYear !== 1) {
      this.showError = true;
      this.errorMessage = 'Session must be 1 year';

      setTimeout(() => {
        this.showError = false;
        this.errorMessage = '';
      }, 3000);
      return;
    }

    const sessionName = `${this.form.value.startYear}/${this.form.value.endYear}`;
    this.sessionService.createSession(sessionName, this.form.value.startYear)
      .subscribe({
        next: (result) => {
          this.createdSessions.push(result);

          this.form.reset();
          this.showSuccess = true;
          this.successMessage = 'Session created successfully';

          setTimeout(() => {
            this.showSuccess = false;
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
          console.error(error);
          this.showError = true;
          this.errorMessage = error.error.message;

          setTimeout(() => {
            this.showError = false;
            this.errorMessage = '';
          }, 3000);
        }
      });
  }
}

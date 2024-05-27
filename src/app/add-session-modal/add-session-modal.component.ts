import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SessionService } from '../services/session.service';
import { MatDialogRef } from '@angular/material/dialog';

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
  
  constructor(
    public dialogRef: MatDialogRef<AddSessionModalComponent>,
    private sessionService: SessionService
  ) {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      startYear: new FormControl(0, Validators.required),
    });
  }

  closeModal() {
    this.dialogRef.close();
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

    this.sessionService.createSession(this.form.value.name, this.form.value.startYear)
      .subscribe({
        next: () => {
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

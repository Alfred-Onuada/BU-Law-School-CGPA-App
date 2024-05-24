import { Component, Inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { SemestersService } from '../services/semesters.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-semester-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-semester-modal.component.html',
  styleUrls: ['./add-semester-modal.component.css']
})
export class AddSemesterModalComponent {
  form: FormGroup;
  showError = false;
  errorMessage = '';
  showSuccess = false;
  successMessage = '';
  loading = false;
  
  constructor(
    private semestersService: SemestersService,
    public dialogRef: MatDialogRef<AddSemesterModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { sessionId: string }
  ) {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
    });
  }

  closeModal() {
    this.dialogRef.close();
  }

  handleSubmit() {
    this.loading = true;

    if (!this.form.valid) {
      this.showError = true;
      this.errorMessage = 'Please fill in all fields correctly';

      this.loading = false;

      setTimeout(() => {
        this.showError = false;
        this.errorMessage = '';
      }, 3000);
      return;
    }

    this.semestersService.createSemester(this.form.value.name, this.data.sessionId)
      .subscribe({
        next: () => {
          this.form.reset();
          this.showSuccess = true;
          this.successMessage = 'Semester created successfully';

          this.loading = false;

          setTimeout(() => {
            this.showSuccess = false;
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
          console.error(error);
          this.showError = true;
          this.errorMessage = error.message;

          this.loading = false;

          setTimeout(() => {
            this.showError = false;
            this.errorMessage = '';
          }, 3000);
        }
      });
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { LevelService } from '../services/level.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-level-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-level-modal.component.html',
  styleUrls: ['./add-level-modal.component.css']
})
export class AddLevelModalComponent {
  form: FormGroup;
  showError = false;
  errorMessage = '';
  showSuccess = false;
  successMessage = '';
  loading = false;
  
  constructor(
    private levelService: LevelService,
    public dialog: MatDialogRef<AddLevelModalComponent>
  ) {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
    });
  }

  closeModal() {
    this.dialog.close();
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

    this.levelService.createLevel(this.form.value.name)
      .subscribe({
        next: () => {
          this.form.reset();
          this.showSuccess = true;
          this.successMessage = 'Level created successfully';

          this.loading = false;

          setTimeout(() => {
            this.showSuccess = false;
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
          console.error(error);
          this.showError = true;
          this.errorMessage = error.error.message;

          this.loading = false;

          setTimeout(() => {
            this.showError = false;
            this.errorMessage = '';
          }, 3000);
        }
      });
  }
}

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
    if (!this.form.valid) {
      this.showError = true;
      this.errorMessage = 'Please fill in all fields correctly';

      setTimeout(() => {
        this.showError = false;
        this.errorMessage = '';
      }, 5000);
      return;
    }

    this.levelService.createLevel(this.form.value.name)
      .subscribe({
        next: () => {
          this.form.reset();
          this.showSuccess = true;
          this.successMessage = 'Level created successfully';

          setTimeout(() => {
            this.showSuccess = false;
            this.successMessage = '';
          }, 5000);
        },
        error: (error) => {
          console.error(error);
          this.showError = true;
          this.errorMessage = error.message;

          setTimeout(() => {
            this.showError = false;
            this.errorMessage = '';
          }, 5000);
        }
      });
  }
}

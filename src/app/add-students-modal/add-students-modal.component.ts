import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudentService } from '../services/student.service';
import * as Papa from 'papaparse';

@Component({
  selector: 'app-add-students-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-students-modal.component.html',
  styleUrls: ['./add-students-modal.component.css']
})
export class AddStudentsModalComponent {
  form: FormGroup;

  showError = false;
  errorMessage = '';
  showSuccess = false;
  successMessage = '';
  csvName = '';
  noOfRows = 0;
  noOfRowsMessage = '';
  students: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddStudentsModalComponent>,
    private studentService: StudentService
  ) {
    this.form = new FormGroup({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      yearEnrolled: new FormControl(null, Validators.required),
      levelAtEnrollment: new FormControl(null, Validators.required),
    });
  }

  closeModal() {
    this.dialogRef.close();
  }

  addBulkStudents() {
    this.studentService.addBulkStudents(this.students)
      .subscribe({
        next: () => {
          this.showSuccess = true;
          this.successMessage = 'Students created successfully';

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

  parseCSVData(event: any): void {
    const file = event.target.files[0];
    this.csvName = file.name;

    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (result) => {
          // reformat to get only the fields I need (firstName, lastName, yearEnrolled, levelAtEnrollment)
          this.students = result.data.map((student: any) => {
            return {
              firstName: student['firstName'],
              lastName: student['lastName'],
              yearEnrolled: student['yearEnrolled'],
              levelAtEnrollment: student['levelAtEnrollment']
            };
          });

          this.noOfRows = this.students.length;
          this.noOfRowsMessage = ` - ${this.students.length} rows dectected`;
        },
        error: () => {
          this.showError = true;
          this.errorMessage = "Error parsing CSV file";

          setTimeout(() => {
            this.showError = false;
            this.errorMessage = '';
          }, 5000);
        }
      });
    }
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

    this.studentService.addStudent(
      this.form.value.firstName,
      this.form.value.lastName,
      this.form.value.yearEnrolled,
      this.form.value.levelAtEnrollment
    )
      .subscribe({
        next: () => {
          this.form.reset();
          this.showSuccess = true;
          this.successMessage = 'Student created successfully';

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

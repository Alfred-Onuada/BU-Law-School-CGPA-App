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

  csvUploadLoading = false;
  regularLoading = false;

  constructor(
    public dialogRef: MatDialogRef<AddStudentsModalComponent>,
    private studentService: StudentService
  ) {
    this.form = new FormGroup({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      matricNo: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]{2}\/[0-9]{4}$/)]),
      yearEnrolled: new FormControl(null, Validators.required),
      levelAtEnrollment: new FormControl(null, Validators.required),
    });
  }

  closeModal() {
    this.dialogRef.close();
  }

  addBulkStudents() {
    this.csvUploadLoading = true;

    this.studentService.addBulkStudents(this.students)
      .subscribe({
        next: () => {
          this.csvUploadLoading = false;

          this.showSuccess = true;
          this.successMessage = 'Students created successfully';

          setTimeout(() => {
            this.showSuccess = false;
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
          console.error(error);
          this.csvUploadLoading = false;

          this.showError = true;
          this.errorMessage = error.message;

          setTimeout(() => {
            this.showError = false;
            this.errorMessage = '';
          }, 3000);
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
              matricNo: student['matricNo'],
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
          }, 3000);
        }
      });
    }
  }

  handleSubmit() {
    this.regularLoading = true;

    if (!this.form.valid) {
      this.regularLoading = false;

      this.showError = true;
      this.errorMessage = 'Please fill in all fields correctly';

      setTimeout(() => {
        this.showError = false;
        this.errorMessage = '';
      }, 3000);
      return;
    }

    this.studentService.addStudent(
      this.form.value.firstName,
      this.form.value.lastName,
      this.form.value.matricNo,
      this.form.value.yearEnrolled,
      this.form.value.levelAtEnrollment
    )
      .subscribe({
        next: () => {
          this.regularLoading = false;

          this.form.reset();
          this.showSuccess = true;
          this.successMessage = 'Student created successfully';

          setTimeout(() => {
            this.showSuccess = false;
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
          this.regularLoading = false;

          console.error(error);
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

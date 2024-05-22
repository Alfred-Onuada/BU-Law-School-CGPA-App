import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICourse } from '../interfaces/course';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-courses-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-courses-modal.component.html',
  styleUrls: ['./edit-courses-modal.component.css']
})
export class EditCoursesModalComponent {  

  selectedLevelId!: string;
  selectedSemesterId!: string;
  courses: ICourse[] = [
    { _id: '1', name: 'Criminal Law', units: 3 },
    { _id: '2', name: 'Contracts', units: 3 },
    { _id: '3', name: 'Torts', units: 3 },
    { _id: '4', name: 'Property', units: 3 },
    { _id: '5', name: 'Civil Procedure', units: 3 },
    { _id: '6', name: 'Constitutional Law', units: 3 },
    { _id: '7', name: 'Legal Writing', units: 3 },
    { _id: '8', name: 'Legal Research', units: 3 },
    { _id: '9', name: 'Professional Responsibility', units: 3 },
  ];

  constructor(
    public dialogRef: MatDialogRef<EditCoursesModalComponent>,
  ) {}

  closeModal() {
    this.dialogRef.close();
  }

  addNewCourse() {
    this.courses.push({ _id: '', name: '', units: 0 });
  }

  handleSubmit() {}
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-students-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-students-modal.component.html',
  styleUrls: ['./add-students-modal.component.css']
})
export class AddStudentsModalComponent {
  constructor(
    public dialogRef: MatDialogRef<AddStudentsModalComponent>,
  ) {}

  closeModal() {
    this.dialogRef.close();
  }
}

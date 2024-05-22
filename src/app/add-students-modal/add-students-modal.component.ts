import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-students-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-students-modal.component.html',
  styleUrls: ['./add-students-modal.component.css']
})
export class AddStudentsModalComponent {
  constructor() {}
}

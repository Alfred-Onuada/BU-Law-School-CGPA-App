import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-grades-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-grades-modal.component.html',
  styleUrls: ['./edit-grades-modal.component.css']
})
export class EditGradesModalComponent {
  form: FormGroup;
  
  constructor(
  ) {
    this.form = new FormGroup({
      newGrade: new FormControl(0, [Validators.required, Validators.max(100), Validators.min(0)]),
    });
  }

  handleSubmit() {}
}

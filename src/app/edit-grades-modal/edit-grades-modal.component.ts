import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';

declare let initFlowbite: any;

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
    private router: Router
  ) {
    this.form = new FormGroup({
      newGrade: new FormControl(0, [Validators.required, Validators.max(100), Validators.min(0)]),
    });
  }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (typeof initFlowbite !== 'undefined') {
          initFlowbite();
        } else {
          console.error('Could not find the global function initFlowbite()');
        }
      }
    });
  }

  handleSubmit() {}
}

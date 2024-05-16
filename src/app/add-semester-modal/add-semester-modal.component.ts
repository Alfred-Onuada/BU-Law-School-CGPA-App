import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';

// Declare the global function
declare let initFlowbite: any;

@Component({
  selector: 'app-add-semester-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-semester-modal.component.html',
  styleUrls: ['./add-semester-modal.component.css']
})
export class AddSemesterModalComponent implements AfterViewInit {
  form: FormGroup;
  
  constructor(
    private router: Router
  ) {
    this.form = new FormGroup({
      semesterTitle: new FormControl('', Validators.required),
    });
  }

  ngAfterViewInit(): void {
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

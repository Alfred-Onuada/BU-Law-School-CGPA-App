import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';

// Declare the global function
declare var initFlowbite: any;

@Component({
  selector: 'app-add-session-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-session-modal.component.html',
  styleUrls: ['./add-session-modal.component.css']
})
export class AddSessionModalComponent implements OnInit {
  form: FormGroup;
  
  constructor(
    private router: Router
  ) {
    this.form = new FormGroup({
      sessionTitle: new FormControl('', Validators.required),
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

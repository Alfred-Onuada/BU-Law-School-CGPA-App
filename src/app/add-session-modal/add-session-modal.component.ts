import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { SessionService } from '../services/session.service';

// Declare the global function
declare let initFlowbite: any;

@Component({
  selector: 'app-add-session-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-session-modal.component.html',
  styleUrls: ['./add-session-modal.component.css']
})
export class AddSessionModalComponent implements AfterViewInit {
  form: FormGroup;
  showError = false;
  errorMessage = '';
  showSuccess = false;
  successMessage = '';
  
  constructor(
    private router: Router,
    private sessionService: SessionService
  ) {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      startYear: new FormControl(0, Validators.required),
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

    this.sessionService.createSession(this.form.value.name, this.form.value.startYear)
      .subscribe({
        next: () => {
          this.form.reset();
          this.showSuccess = true;
          this.successMessage = 'Session created successfully';

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

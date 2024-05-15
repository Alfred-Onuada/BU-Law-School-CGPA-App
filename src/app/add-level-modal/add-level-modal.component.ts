import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';

// Declare the global function
declare var initFlowbite: any;

@Component({
  selector: 'app-add-level-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-level-modal.component.html',
  styleUrls: ['./add-level-modal.component.css']
})
export class AddLevelModalComponent {
  form: FormGroup;
  
  constructor(
    private router: Router
  ) {
    this.form = new FormGroup({
      levelTitle: new FormControl('', Validators.required),
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

import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';

declare let initFlowbite: any;

@Component({
  selector: 'app-add-students-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-students-modal.component.html',
  styleUrls: ['./add-students-modal.component.css']
})
export class AddStudentsModalComponent implements AfterViewInit {
  constructor(
    private router: Router
  ) {}

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
}

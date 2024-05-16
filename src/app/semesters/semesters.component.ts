import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { HeaderComponent } from "../header/header.component";
import { ISemester } from '../interfaces/semester';
import { Router, RouterLink } from '@angular/router';
import { AddSemesterModalComponent } from "../add-semester-modal/add-semester-modal.component";
import { Subscription } from 'rxjs';
import { SemestersService } from '../services/semesters.service';
import { ISession } from '../interfaces/session';

@Component({
    selector: 'app-semesters',
    standalone: true,
    templateUrl: './semesters.component.html',
    styleUrls: ['./semesters.component.css'],
    imports: [CommonModule, HeaderComponent, RouterLink, AddSemesterModalComponent]
})
export class SemestersComponent implements OnInit {
  constructor(
    private titleService: Title,
    private router: Router,
    private semesterService: SemestersService
  ) {
    this.titleService.setTitle("Semesters - Babcock University School of Law and Security Studies");
  }

  session!: ISession;
  semesters: ISemester[] = []
  semestersSub$!: Subscription;
  loading = true;
  showError = false;
  errorMessage = '';
  sessionId = '';

  ngOnInit() {
    this.sessionId = this.router.parseUrl(this.router.url).queryParams['sessionId'];

    this.semestersSub$ = this.semesterService.getSemesters(this.sessionId).subscribe({
      next: ({semesters, session}) => {
        this.semesters = semesters;
        this.session = session;
        this.loading = false;
      },
      error: (error) => {
        console.error(error);

        this.showError = true;
        this.errorMessage = error.message;
        
        setTimeout(() => {
          this.showError = false;
          this.errorMessage = '';
          this.loading = false;
        }, 5000);
      },
      complete: () => {
        this.semestersSub$.unsubscribe();
      }
    });
  }
}

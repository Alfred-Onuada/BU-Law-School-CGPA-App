import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { HeaderComponent } from "../header/header.component";
import { Router, RouterLink } from '@angular/router';
import { IStudent } from '../interfaces/students';
import { ISession } from '../interfaces/session';
import { ISemester } from '../interfaces/semester';
import { Subscription } from 'rxjs';
import { SemestersService } from '../services/semesters.service';
import { SessionService } from '../services/session.service';

@Component({
    selector: 'app-students',
    standalone: true,
    templateUrl: './students.component.html',
    styleUrls: ['./students.component.css'],
    imports: [CommonModule, HeaderComponent, RouterLink]
})
export class StudentsComponent implements OnInit {
  sessionId: string;
  level: string;
  semesterId: string;
  
  students: IStudent[] = [];
  studentsSub$!: Subscription;
  session!: ISession;
  sessionSub$!: Subscription;
  semester!: ISemester;
  semesterSub$!: Subscription;

  currentPage: number = 1;
  totalPages: number = 1;

  showError = false;
  errorMessage = '';
  loading = true;

  constructor(
    private titleService: Title,
    private router: Router,
    private semesterService: SemestersService,
    private sessionService: SessionService
  ) {
    this.titleService.setTitle('Students - Babcock University School of Law and Security Studies');
    this.sessionId = this.router.parseUrl(this.router.url).queryParams['sessionId'];
    this.level = this.router.parseUrl(this.router.url).queryParams['level'];
    this.semesterId = this.router.parseUrl(this.router.url).queryParams['semesterId'];
  }

  ngOnInit() {
    this.semesterSub$ = this.semesterService.getSemester(this.semesterId).subscribe({
      next: (semester) => {
        this.semester = semester;
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
        this.semesterSub$.unsubscribe();
      }
    });

    this.sessionSub$ = this.sessionService.getSession(this.sessionId).subscribe({
      next: (session) => {
        this.session = session;
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
        this.sessionSub$.unsubscribe();
      }
    });
  }

  prevPage() {}

  nextPage() {}
}

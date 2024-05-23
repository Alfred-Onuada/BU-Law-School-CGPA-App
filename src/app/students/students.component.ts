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
import { StudentService } from '../services/student.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-students',
    standalone: true,
    templateUrl: './students.component.html',
    styleUrls: ['./students.component.css'],
    imports: [CommonModule, HeaderComponent, RouterLink, FormsModule]
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
  pageSize: number = 10;

  showError = false;
  errorMessage = '';
  loading = true;

  private query: string = '';

  get searchTerm(): string {
    return this.query;
  }

  set searchTerm(value: string) {
    this.query = value;

    if (this.query.trim().length === 0) {
      this.resetSearch();
    }

    if (this.query.trim().length >= 2) {
      this.searchStudents();
    }
  }

  constructor(
    private titleService: Title,
    private router: Router,
    private semesterService: SemestersService,
    private sessionService: SessionService,
    private studentService: StudentService
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
        }, 3000);
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
        }, 3000);
      },
      complete: () => {
        this.sessionSub$.unsubscribe();
      }
    });

    this.studentsSub$ = this.studentService.getStudents(this.sessionId, +this.level, this.pageSize).subscribe({
      next: (result) => {
        this.students = result.students;
        this.totalPages = Math.ceil(result.total / this.pageSize);
      },
      error: (error) => {
        console.error(error);

        this.showError = true;
        this.errorMessage = error.message;

        setTimeout(() => {
          this.showError = false;
          this.errorMessage = '';
          this.loading = false;
        }, 3000);
      },
      complete: () => {
        this.studentsSub$.unsubscribe();
      }
    });
  }

  prevPage() {
    if (this.currentPage <= 1) {
      return;
    }

    this.currentPage--;
    this.loading = true;

    this.studentsSub$ = this.studentService.getStudents(this.sessionId, +this.level, this.pageSize, this.currentPage, this.query).subscribe({
      next: (result) => {
        this.students = result.students;
        this.totalPages = Math.ceil(result.total / this.pageSize);
      },
      error: (error) => {
        console.error(error);

        this.showError = true;
        this.errorMessage = error.message;

        setTimeout(() => {
          this.showError = false;
          this.errorMessage = '';
          this.loading = false;
        }, 3000);
      },
      complete: () => {
        this.studentsSub$.unsubscribe();
      }
    });
  }

  nextPage() {
    if (this.currentPage >= this.totalPages) {
      return;
    }

    this.currentPage++;
    this.loading = true;

    this.studentsSub$ = this.studentService.getStudents(this.sessionId, +this.level, this.pageSize, this.currentPage, this.query).subscribe({
      next: (result) => {
        this.students = result.students;
        this.totalPages = Math.ceil(result.total / this.pageSize);
      },
      error: (error) => {
        console.error(error);

        this.showError = true;
        this.errorMessage = error.message;

        setTimeout(() => {
          this.showError = false;
          this.errorMessage = '';
          this.loading = false;
        }, 3000);
      },
      complete: () => {
        this.studentsSub$.unsubscribe();
      }
    });
  }

  searchStudents() {
    this.loading = true;

    this.studentsSub$ = this.studentService.getStudents(this.sessionId, +this.level, this.pageSize, 0, this.query).subscribe({
      next: (result) => {
        this.students = result.students;
        this.totalPages = Math.ceil(result.total / this.pageSize);
        this.currentPage = 1;
      },
      error: (error) => {
        console.error(error);

        this.showError = true;
        this.errorMessage = error.message;

        setTimeout(() => {
          this.showError = false;
          this.errorMessage = '';
          this.loading = false;
        }, 3000);
      },
      complete: () => {
        this.studentsSub$.unsubscribe();
      }
    });
  }

  resetSearch() {
    this.query = '';
    this.loading = true;

    this.studentsSub$ = this.studentService.getStudents(this.sessionId, +this.level, this.pageSize, 0, this.query).subscribe({
      next: (result) => {
        this.students = result.students;
        this.totalPages = Math.ceil(result.total / this.pageSize);
        this.currentPage = 1;
      },
      error: (error) => {
        console.error(error);

        this.showError = true;
        this.errorMessage = error.message;

        setTimeout(() => {
          this.showError = false;
          this.errorMessage = '';
          this.loading = false;
        }, 3000);
      },
      complete: () => {
        this.studentsSub$.unsubscribe();
      }
    });
  }

  exportAllStudents() {
    this.studentsSub$ = this.studentService.getStudents(this.sessionId, +this.level, -1, 0, this.query).subscribe({
      next: (result) => {
        const csv = this.convertToCSV(result.students);
        const blob = this.createBlob(csv);
        this.downloadCSV(blob, 'students-full.csv');
      },
      error: (error) => {
        console.error(error);

        this.showError = true;
        this.errorMessage = error.message;

        setTimeout(() => {
          this.showError = false;
          this.errorMessage = '';
          this.loading = false;
        }, 3000);
      },
      complete: () => {
        this.studentsSub$.unsubscribe();
      }
    });
  }

  exportResults() {
    this.studentsSub$ = this.studentService.getStudents(this.sessionId, +this.level, this.pageSize, this.currentPage, this.query).subscribe({
      next: (result) => {
        const csv = this.convertToCSV(result.students);
        const blob = this.createBlob(csv);
        this.downloadCSV(blob, `students (${this.query}).csv`);
      },
      error: (error) => {
        console.error(error);

        this.showError = true;
        this.errorMessage = error.message;

        setTimeout(() => {
          this.showError = false;
          this.errorMessage = '';
          this.loading = false;
        }, 3000);
      },
      complete: () => {
        this.studentsSub$.unsubscribe();
      }
    });
  }

  convertToCSV(array: any[]): string {
    const header = Object.keys(array[0]).join(',');
    const rows = array.map(obj => 
      Object.values(obj).map(value => 
        typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
      ).join(',')
    );
    return [header, ...rows].join('\r\n');
  }

  createBlob(csv: string): Blob {
    return new Blob([csv], { type: 'text/csv' });
  }

  downloadCSV(blob: Blob, filename: string) {
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

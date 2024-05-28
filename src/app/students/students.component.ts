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
  semesterLoading = true;
  sessionLoading = true;
  studentLoading = true;
  paginationLoading = false;
  searchLoading = false;
  exportResultsLoading = false;
  exportAllStudentsLoading = false;

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

        this.semesterLoading = false;
      },
      error: (error) => {
        console.error(error);

        this.showError = true;
        this.errorMessage = error.error.message;

        setTimeout(() => {
          this.showError = false;
          this.errorMessage = '';
          this.semesterLoading = false;
        }, 3000);
      },
      complete: () => {
        this.semesterSub$.unsubscribe();
      }
    });

    this.sessionSub$ = this.sessionService.getSession(this.sessionId).subscribe({
      next: (session) => {
        this.session = session;

        this.sessionLoading = false;
      },
      error: (error) => {
        console.error(error);

        this.showError = true;
        this.errorMessage = error.error.message;

        setTimeout(() => {
          this.showError = false;
          this.errorMessage = '';
          this.sessionLoading = false;
        }, 3000);
      },
      complete: () => {
        this.sessionSub$.unsubscribe();
      }
    });

    this.studentsSub$ = this.studentService.getStudents(this.sessionId, +this.level, this.semesterId, this.pageSize).subscribe({
      next: (result) => {
        this.students = result.students;
        this.totalPages = Math.ceil(result.total / this.pageSize);

        this.studentLoading = false;
      },
      error: (error) => {
        console.error(error);

        this.showError = true;
        this.errorMessage = error.error.message;

        setTimeout(() => {
          this.showError = false;
          this.errorMessage = '';
          this.studentLoading = false;
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

    this.paginationLoading = true;
    this.currentPage--;

    this.studentsSub$ = this.studentService.getStudents(this.sessionId, +this.level, this.semesterId, this.pageSize, this.currentPage, this.query).subscribe({
      next: (result) => {
        this.students = result.students;
        this.totalPages = Math.ceil(result.total / this.pageSize);

        this.paginationLoading = false;
      },
      error: (error) => {
        console.error(error);

        this.showError = true;
        this.errorMessage = error.error.message;
        
        this.paginationLoading = false;

        setTimeout(() => {
          this.showError = false;
          this.errorMessage = '';
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
    this.paginationLoading = true;

    this.studentsSub$ = this.studentService.getStudents(this.sessionId, +this.level, this.semesterId, this.pageSize, this.currentPage, this.query).subscribe({
      next: (result) => {
        this.students = result.students;
        this.totalPages = Math.ceil(result.total / this.pageSize);

        this.paginationLoading = false;
      },
      error: (error) => {
        console.error(error);

        this.showError = true;
        this.errorMessage = error.error.message;
        
        this.paginationLoading = false;

        setTimeout(() => {
          this.showError = false;
          this.errorMessage = '';
        }, 3000);
      },
      complete: () => {
        this.studentsSub$.unsubscribe();
      }
    });
  }

  searchStudents() {
    this.searchLoading = true;

    this.studentsSub$ = this.studentService.getStudents(this.sessionId, +this.level, this.semesterId, this.pageSize, 0, this.query).subscribe({
      next: (result) => {
        this.students = result.students;
        this.totalPages = Math.ceil(result.total / this.pageSize);
        this.currentPage = 1;

        this.searchLoading = false;
      },
      error: (error) => {
        console.error(error);

        this.showError = true;
        this.errorMessage = error.error.message;
        
        this.searchLoading = false;

        setTimeout(() => {
          this.showError = false;
          this.errorMessage = '';
        }, 3000);
      },
      complete: () => {
        this.studentsSub$.unsubscribe();
      }
    });
  }

  resetSearch() {
    this.query = '';
    this.searchLoading = true;

    this.studentsSub$ = this.studentService.getStudents(this.sessionId, +this.level, this.semesterId, this.pageSize, 0, this.query).subscribe({
      next: (result) => {
        this.students = result.students;
        this.totalPages = Math.ceil(result.total / this.pageSize);
        this.currentPage = 1;

        this.searchLoading = false;
      },
      error: (error) => {
        console.error(error);

        this.showError = true;
        this.errorMessage = error.error.message;
        
        this.searchLoading = false;

        setTimeout(() => {
          this.showError = false;
          this.errorMessage = '';
        }, 3000);
      },
      complete: () => {
        this.studentsSub$.unsubscribe();
      }
    });
  }

  exportAllStudents() {
    this.exportAllStudentsLoading = true;

    this.studentsSub$ = this.studentService.getStudents(this.sessionId, +this.level, this.semesterId, -1, 0, this.query).subscribe({
      next: (result) => {
        const csv = this.convertToCSV(result.students);
        const blob = this.createBlob(csv);
        this.downloadCSV(blob, `${this.session.name.replace('/', '_')} - ${this.semester.name} - ${this.level}.csv`);

        this.exportAllStudentsLoading = false;
      },
      error: (error) => {
        console.error(error);

        this.showError = true;
        this.errorMessage = error.error.message;

        this.exportAllStudentsLoading = false;

        setTimeout(() => {
          this.showError = false;
          this.errorMessage = '';
        }, 3000);
      },
      complete: () => {
        this.studentsSub$.unsubscribe();
      }
    });
  }

  exportResults() {
    this.exportResultsLoading = true;

    this.studentsSub$ = this.studentService.getStudents(this.sessionId, +this.level, this.semesterId, this.pageSize, this.currentPage, this.query).subscribe({
      next: (result) => {
        const csv = this.convertToCSV(result.students);
        const blob = this.createBlob(csv);
        this.downloadCSV(blob, `(${this.query}) - ${this.session.name.replace('/', '_')} - ${this.semester.name} - ${this.level}.csv`);

        this.exportResultsLoading = false;
      },
      error: (error) => {
        console.error(error);

        this.showError = true;
        this.errorMessage = error.error.message;

        this.exportResultsLoading = false;

        setTimeout(() => {
          this.showError = false;
          this.errorMessage = '';
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

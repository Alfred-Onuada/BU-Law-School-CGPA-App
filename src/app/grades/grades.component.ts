import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { HeaderComponent } from '../header/header.component';
import { Router, RouterLink } from '@angular/router';
import { EditGradesModalComponent } from "../edit-grades-modal/edit-grades-modal.component";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ISemester } from '../interfaces/semester';
import { ISession } from '../interfaces/session';
import { IStudent } from '../interfaces/students';
import { Subscription } from 'rxjs';
import { SessionService } from '../services/session.service';
import { SemestersService } from '../services/semesters.service';
import { StudentService } from '../services/student.service';
import { ICoursesAndGrade } from '../interfaces/courses-and-grades';
import { GradesService } from '../services/grades.service';

@Component({
    selector: 'app-courses',
    standalone: true,
    templateUrl: './grades.component.html',
    styleUrls: ['./grades.component.css'],
    imports: [CommonModule, HeaderComponent, RouterLink, MatDialogModule]
})
export class CoursesComponent {
  sessionId!: string;
  semesterId!: string;
  level!: string;
  studentId!: string;

  session!: ISession;
  semester!: ISemester;
  student!: IStudent;
  coursesAndGrade: ICoursesAndGrade[] = [];

  sessionSub$!: Subscription;
  semesterSub$!: Subscription;
  studentSub$!: Subscription;
  coursesAndGradeSub$!: Subscription;

  showError = false;
  errorMessage = '';

  sessionLoading = true;
  semesterLoading = true;
  studentLoading = true;
  coursesAndGradeLoading = true;
  exportResultLoading = false;

  constructor(
    private router: Router,
    private titleService: Title,
    public dialog: MatDialog,
    private sessionService: SessionService,
    private semesterService: SemestersService,
    private studentService: StudentService,
    private gradeService: GradesService
    // I will need a grade service
  ) {
    // fetch Ids from route params
    this.sessionId = this.router.parseUrl(this.router.url).queryParams['sessionId'];
    this.semesterId = this.router.parseUrl(this.router.url).queryParams['semesterId'];
    this.level = this.router.parseUrl(this.router.url).queryParams['level'];
    this.studentId = this.router.parseUrl(this.router.url).queryParams['studentId'];

    // fetch session, semester and student
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
    })

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
    })

    this.studentSub$ = this.studentService.getStudent(this.studentId).subscribe({
      next: (student) => {
        this.student = student;

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
        this.studentSub$.unsubscribe();
      }
    })

    this.coursesAndGradeSub$ = this.gradeService.getCoursesAndGrade(this.sessionId, this.semesterId, this.level, this.studentId).subscribe({
      next: (result) => {
        this.coursesAndGrade = result;

        this.coursesAndGradeLoading = false;
      },
      error: (error) => {
        console.error(error);

        this.showError = true;
        this.errorMessage = error.error.message;

        setTimeout(() => {
          this.showError = false;
          this.errorMessage = '';
          this.coursesAndGradeLoading = false;
        }, 3000);
      },
      complete: () => {
        this.coursesAndGradeSub$.unsubscribe();
      }
    });

    this.titleService.setTitle(
      'Courses - Babcock University School of Law and Security Studies'
    );
  }

  openEditModal(course: ICoursesAndGrade) {
    this.dialog.open(EditGradesModalComponent, { data: course })
      .afterClosed()
      .subscribe((result: ICoursesAndGrade) => {
        if (result) {
          this.coursesAndGrade = this.coursesAndGrade.map((course) => {
            if (course.courseId === result.courseId) {
              course.score = result.score;
              course.grade = result.grade;
            }
            return course;
          });
        }
      });
  }

  exportResult() {
    this.exportResultLoading = true;

    const csv = this.convertToCSV(this.coursesAndGrade);
    const blob = this.createBlob(csv);
    this.downloadCSV(blob, `${this.student.lastName} ${this.student.firstName} - ${this.semester.name} - ${this.level} level.csv`);

    this.exportResultLoading = false;
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

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICourse } from '../interfaces/course';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { ISession } from '../interfaces/session';
import { ISemester } from '../interfaces/semester';
import { ILevel } from '../interfaces/level';
import { SessionService } from '../services/session.service';
import { LevelService } from '../services/level.service';
import { Subscription } from 'rxjs';
import { SemestersService } from '../services/semesters.service';
import { CoursesService } from '../services/courses.service';

@Component({
  selector: 'app-edit-courses-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-courses-modal.component.html',
  styleUrls: ['./edit-courses-modal.component.css'],
})
export class EditCoursesModalComponent {
  courses: ICourse[] = [];
  coursesSub$!: Subscription;
  sessions: ISession[] = [];
  sessionsSub$!: Subscription;
  semesters: ISemester[] = [];
  semestersSub$!: Subscription;
  levels: ILevel[] = [];
  levelsSub$!: Subscription;

  sessionLoading = true;
  semesterLoading = false;
  levelLoading = true;
  fetchingCourses = false;
  saveCoursesLoading = false;
  removeCoursesLoading = false;

  private selectedSessionId!: string;
  private selectedLevel!: string;
  private selectedSemesterId!: string;

  get sessionId() {
    return this.selectedSessionId;
  }

  set sessionId(value: string) {
    this.selectedSessionId = value;
    this.courses = [];

    // fetch the semesters
    this.fetchSemesters();
  }

  get level() {
    return this.selectedLevel;
  }

  set level(value: string) {
    this.selectedLevel = value;
    this.courses = [];
  }

  get semesterId() {
    return this.selectedSemesterId;
  }

  set semesterId(value: string) {
    this.selectedSemesterId = value;
    this.courses = [];
  }

  showError = false;
  errorMessage = '';
  showSuccess = false;
  successMessage = '';

  constructor(
    public dialogRef: MatDialogRef<EditCoursesModalComponent>,
    private sessionService: SessionService,
    private levelService: LevelService,
    private semsterService: SemestersService,
    private coursesService: CoursesService
  ) {
    // fetch the sessions and levels
    this.sessionsSub$ = this.sessionService.getSessions().subscribe({
      next: (session) => {
        this.sessions = session;

        this.sessionLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.sessionLoading = false;

        this.showError = true;
        this.errorMessage = error.error.message;

        setTimeout(() => {
          this.showError = false;
          this.errorMessage = '';
        }, 3000);
      },
      complete: () => {
        this.sessionsSub$.unsubscribe();
      },
    });

    this.levelsSub$ = this.levelService.getLevels().subscribe({
      next: (level) => {
        this.levels = level;

        this.levelLoading = false;
      },
      error: (error) => {
        console.error(error);

        this.levelLoading = false;

        this.showError = true;
        this.errorMessage = error.error.message;

        setTimeout(() => {
          this.showError = false;
          this.errorMessage = '';
        }, 3000);
      },
      complete: () => {
        this.levelsSub$.unsubscribe();
      },
    });
  }

  fetchSemesters() {
    this.semesterLoading = true;

    this.semestersSub$ = this.semsterService
      .getSemesters(this.sessionId)
      .subscribe({
        next: ({semesters}) => {
          this.semesters = semesters;

          this.semesterLoading = false;
        },
        error: (error) => {
          console.error(error);

          this.semesterLoading = false;

          this.showError = true;
          this.errorMessage = error.error.message;

          setTimeout(() => {
            this.showError = false;
            this.errorMessage = '';
          }, 3000);
        },
        complete: () => {
          this.semestersSub$.unsubscribe();
        },
      });
  }

  closeModal() {
    this.dialogRef.close();
  }

  addNewCourse() {
    if (!this.sessionId || !this.semesterId || !this.level) {
      this.showError = true;
      this.errorMessage = 'Please select a session, semester and level then try again';

      setTimeout(() => {
        this.showError = false;
        this.errorMessage = '';
      }, 3000);
      return;
    }

    this.courses.push({
      id: '',
      name: '',
      units: 0,
      level: +this.level,
      sessionId: this.sessionId,
      semesterId: this.semesterId,
    });
  }

  fetchCourses() {
    this.fetchingCourses = true;

    if (!this.sessionId || !this.semesterId || !this.level) {
      this.showError = true;
      this.errorMessage = 'Please select a session, semester and level';

      this.fetchingCourses = false;

      setTimeout(() => {
        this.showError = false;
        this.errorMessage = '';
      }, 3000);
      return;
    }

    this.coursesSub$ = this.coursesService
      .getCourses(this.sessionId, this.semesterId, +this.level)
      .subscribe({
        next: (courses) => {
          this.courses = courses;

          this.fetchingCourses = false;

          this.showSuccess = true;
          this.successMessage = this.courses.length === 0 ? 'No courses yet, go ahead and add some' : 'Courses fetched successfully';

          setTimeout(() => {
            this.showSuccess = false;
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
          console.error(error);

          this.fetchingCourses = false;

          this.showError = true;
          this.errorMessage = error.error.message;

          setTimeout(() => {
            this.showError = false;
            this.errorMessage = '';
          }, 3000);
        },
        complete: () => {
          this.coursesSub$.unsubscribe();
        },
      });
  }

  saveCourses() {
    this.saveCoursesLoading = true;

    if (this.courses.length === 0) {
      this.showError = true;
      this.errorMessage = 'No courses to save, please add some courses and try again';

      this.saveCoursesLoading = false;

      setTimeout(() => {
        this.showError = false;
        this.errorMessage = '';
      }, 3000);

      return;
    }

    this.coursesSub$ = this.coursesService.saveCourses(this.courses).subscribe({
      next: (response) => {
        this.showSuccess = true;
        this.successMessage = 'Courses saved successfully';

        this.saveCoursesLoading = false;

        setTimeout(() => {
          this.showSuccess = false;
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error(error);

        this.showError = true;
        this.errorMessage = error.error.message;

        this.saveCoursesLoading = false;

        setTimeout(() => {
          this.showError = false;
          this.errorMessage = '';
        }, 3000);
      },
      complete: () => {
        this.coursesSub$.unsubscribe();
      },
    })
  }

  updateCourse(event: any, idx: number, field: keyof ICourse) {
    if (field === 'name') {
      this.courses[idx].name = event.target.value;
    } else if (field === 'units') {
      this.courses[idx].units = +event.target.value;
    }
  }

  removeCourse(idx: number) {
    this.removeCoursesLoading = true;

    // if course has not been saved yet
    if (this.courses[idx].id == '') {
      this.courses = this.courses.filter((course, index) => index !== idx);

      this.showSuccess = true;
      this.successMessage = 'Course removed successfully';

      this.removeCoursesLoading = false;

      setTimeout(() => {
        this.showSuccess = false;
        this.successMessage = '';
      }, 3000);

      return;
    }

    // if course has been saved
    this.coursesSub$ = this.coursesService.deleteCourse(this.courses[idx].id).subscribe({
      next: (response) => {
        this.courses = this.courses.filter((course, index) => index !== idx);

        this.showSuccess = true;
        this.successMessage = 'Course removed successfully';

        this.removeCoursesLoading = false;

        setTimeout(() => {
          this.showSuccess = false;
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error(error);

        this.showError = true;
        this.errorMessage = error.error.message;

        this.removeCoursesLoading = false;

        setTimeout(() => {
          this.showError = false;
          this.errorMessage = '';
        }, 3000);
      },
      complete: () => {
        this.coursesSub$.unsubscribe();
      },
    });
  }
}

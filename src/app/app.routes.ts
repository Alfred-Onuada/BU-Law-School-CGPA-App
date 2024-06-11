import { Routes } from '@angular/router';
import { SessionsComponent } from './sessions/sessions.component';
import { SemestersComponent } from './semesters/semesters.component';
import { LevelsComponent } from './levels/levels.component';
import { StudentsComponent } from './students/students.component';
import { CoursesComponent } from './grades/grades.component';
import { AllStudentsListComponent } from './all-students-list/all-students-list.component';
import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
  { path: '', component: SessionsComponent },
  { path: 'semesters', component: SemestersComponent },
  { path: 'levels', component: LevelsComponent },
  { path: 'students', component: StudentsComponent },
  { path: 'grades', component: CoursesComponent },
  { path: 'all-students', component: AllStudentsListComponent },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '404' },
];

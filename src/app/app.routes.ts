import { Routes } from '@angular/router';
import { SessionsComponent } from './sessions/sessions.component';
import { SemestersComponent } from './semesters/semesters.component';
import { LevelsComponent } from './levels/levels.component';
import { StudentsComponent } from './students/students.component';
import { CoursesComponent } from './grades/grades.component';

export const routes: Routes = [
  { path: '', component: SessionsComponent },
  { path: 'semesters', component: SemestersComponent },
  { path: 'levels', component: LevelsComponent },
  { path: 'students', component: StudentsComponent },
  { path: 'grades', component: CoursesComponent },
];

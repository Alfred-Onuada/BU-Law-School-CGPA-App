import { Routes } from '@angular/router';
import { SessionsComponent } from './sessions/sessions.component';
import { SemestersComponent } from './semesters/semesters.component';
import { LevelsComponent } from './levels/levels.component';
import { StudentsComponent } from './students/students.component';
import { CoursesComponent } from './grades/grades.component';
import { AllStudentsListComponent } from './all-students-list/all-students-list.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guard/auth.guard';
import { TranscriptComponent } from './transcript/transcript.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: SessionsComponent, canActivate: [AuthGuard]  },
  { path: 'semesters', component: SemestersComponent, canActivate: [AuthGuard]  },
  { path: 'levels', component: LevelsComponent, canActivate: [AuthGuard]  },
  { path: 'students', component: StudentsComponent, canActivate: [AuthGuard]  },
  { path: 'grades', component: CoursesComponent, canActivate: [AuthGuard]  },
  { path: 'all-students', component: AllStudentsListComponent, canActivate: [AuthGuard]  },
  { path: 'transcript', component: TranscriptComponent, canActivate: [AuthGuard]  },
  { path: '404', component: NotFoundComponent, canActivate: [AuthGuard]  },
  { path: '**', redirectTo: '404' },
];

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { HeaderComponent } from '../header/header.component';
import { RouterLink } from '@angular/router';
import { IStudentCourses } from '../interfaces/student-courses';

@Component({
  selector: 'app-courses',
  standalone: true,
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
  imports: [CommonModule, HeaderComponent, RouterLink],
})
export class CoursesComponent {
  constructor(private titleService: Title) {
    this.titleService.setTitle(
      'Courses - Babcock University School of Law and Security Studies'
    );
  }

  studentCourseAndGrades: IStudentCourses = {
    levelTitle: '100 Level',
    levelId: '1',
    semesterId: '1',
    semesterTitle: 'First Semester',
    sessionId: '1',
    sessionTitle: '2023/2024',
    studentName: 'Michael Johnson',
    courses: [
      { _id: '1', title: 'Introduction to Law', score: 88, grade: 'A' },
      { _id: '2', title: 'Criminal Justice System', score: 76, grade: 'B' },
      { _id: '3', title: 'Constitutional Law', score: 92, grade: 'A' },
      { _id: '4', title: 'Torts', score: 85, grade: 'B' },
      { _id: '5', title: 'Civil Procedure', score: 90, grade: 'A' },
      { _id: '6', title: 'Legal Writing', score: 82, grade: 'B' },
      { _id: '7', title: 'Contracts', score: 95, grade: 'A' },
      { _id: '8', title: 'Property Law', score: 88, grade: 'A' },
      { _id: '9', title: 'Criminal Law', score: 85, grade: 'B' },
      { _id: '10', title: 'Evidence', score: 92, grade: 'A' },
    ],
  };
}

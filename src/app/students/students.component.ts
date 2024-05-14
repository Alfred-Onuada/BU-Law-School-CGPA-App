import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { HeaderComponent } from "../header/header.component";
import { RouterLink } from '@angular/router';
import { IStudent } from '../interfaces/students';

@Component({
    selector: 'app-students',
    standalone: true,
    templateUrl: './students.component.html',
    styleUrls: ['./students.component.css'],
    imports: [CommonModule, HeaderComponent, RouterLink]
})
export class StudentsComponent {
  constructor(
    private titleService: Title
  ) {
    this.titleService.setTitle('Students - Babcock University School of Law and Security Studies');
  }

  students: IStudent = {
    levelTitle: '100 Level',
    levelId: '1',
    semesterId: '1',
    semesterTitle: 'First Semester',
    sessionId: '1',
    sessionTitle: '2019/2020',
    currentPage: 1,
    totalPages: 10,
    students: [
      { _id: '1', name: 'Michael Johnson', semesterGPA: 3.8, CGPA: 3.8 },
      { _id: '2', name: 'Emily Williams', semesterGPA: 3.5, CGPA: 3.5 },
      { _id: '3', name: 'Daniel Brown', semesterGPA: 3.2, CGPA: 3.2 },
      { _id: '4', name: 'Sophia Davis', semesterGPA: 3.7, CGPA: 3.7 },
      { _id: '5', name: 'Ethan Martinez', semesterGPA: 3.9, CGPA: 3.9 },
      { _id: '6', name: 'Olivia Taylor', semesterGPA: 3.6, CGPA: 3.6 },
      { _id: '7', name: 'Matthew Anderson', semesterGPA: 3.4, CGPA: 3.4 },
      { _id: '8', name: 'Ava Thomas', semesterGPA: 3.8, CGPA: 3.8 },
      { _id: '9', name: 'William Wilson', semesterGPA: 3.3, CGPA: 3.3 },
      { _id: '10', name: 'Isabella Clark', semesterGPA: 3.7, CGPA: 3.7 }
    ]
  };

  prevPage() {}

  nextPage() {}
}

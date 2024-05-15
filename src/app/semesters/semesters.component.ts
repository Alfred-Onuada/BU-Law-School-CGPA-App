import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { HeaderComponent } from "../header/header.component";
import { ISemester } from '../interfaces/semester';
import { RouterLink } from '@angular/router';
import { AddSemesterModalComponent } from "../add-semester-modal/add-semester-modal.component";

@Component({
    selector: 'app-semesters',
    standalone: true,
    templateUrl: './semesters.component.html',
    styleUrls: ['./semesters.component.css'],
    imports: [CommonModule, HeaderComponent, RouterLink, AddSemesterModalComponent]
})
export class SemestersComponent {
  constructor(
    private titleService: Title,
  ) {
    this.titleService.setTitle("Semesters - Babcock University School of Law and Security Studies");
  }

  semesters: ISemester[] = [
    { _id: '1', title: 'First Semester', createdAt: new Date(), sessionTitle: '2021/2022', sessionId: '1' },
    { _id: '2', title: 'Second Semester', createdAt: new Date(), sessionTitle: '2021/2022', sessionId: '1' },
    { _id: '3', title: 'Summer Semester', createdAt: new Date(), sessionTitle: '2021/2022', sessionId: '1' },
  ]
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../header/header.component";
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ILevel } from '../interfaces/level';
import { AddLevelModalComponent } from "../add-level-modal/add-level-modal.component";

@Component({
    selector: 'app-levels',
    standalone: true,
    templateUrl: './levels.component.html',
    styleUrls: ['./levels.component.css'],
    imports: [CommonModule, HeaderComponent, RouterLink, AddLevelModalComponent]
})
export class LevelsComponent {
    constructor(
        private titleService: Title,
    ) {
        this.titleService.setTitle("Levels - Babcock University School of Law and Security Studies");
    }

    levels: ILevel[] = [
        { _id: '1', title: '100 Level', createdAt: new Date(), sessionTitle: '2020/2021', sessionId: '1', semesterTitle: 'First Semester', semesterId: '1' },
        { _id: '2', title: '200 Level', createdAt: new Date(), sessionTitle: '2020/2021', sessionId: '1', semesterTitle: 'First Semester', semesterId: '1' },
        { _id: '3', title: '300 Level', createdAt: new Date(), sessionTitle: '2020/2021', sessionId: '1', semesterTitle: 'First Semester', semesterId: '1' },
        { _id: '4', title: '400 Level', createdAt: new Date(), sessionTitle: '2020/2021', sessionId: '1', semesterTitle: 'First Semester', semesterId: '1' },
        { _id: '5', title: '500 Level', createdAt: new Date(), sessionTitle: '2020/2021', sessionId: '1', semesterTitle: 'First Semester', semesterId: '1' },
    ];
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../header/header.component";
import { ISession } from '../interfaces/session';
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser'

@Component({
    selector: 'app-sessions',
    standalone: true,
    templateUrl: './sessions.component.html',
    styleUrls: ['./sessions.component.css'],
    imports: [CommonModule, HeaderComponent, RouterLink]
})
export class SessionsComponent {
    sessions: ISession[] = [
        {_id: '1', title: '2021/2022', createdAt: new Date()},
        {_id: '2', title: '2022/2023', createdAt: new Date()},
        {_id: '3', title: '2023/2024', createdAt: new Date()},
        {_id: '4', title: '2024/2025', createdAt: new Date()},
        {_id: '1', title: '2025/2026', createdAt: new Date()},
    ]

    constructor(
        private titleService: Title,
    ) {
        this.titleService.setTitle("Sessions - Babcock University School of Law and Security Studies");
    }
}

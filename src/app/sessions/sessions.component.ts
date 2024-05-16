import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../header/header.component";
import { ISession } from '../interfaces/session';
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser'
import { AddSessionModalComponent } from "../add-session-modal/add-session-modal.component";
import { SessionService } from '../services/session.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-sessions',
    standalone: true,
    templateUrl: './sessions.component.html',
    styleUrls: ['./sessions.component.css'],
    imports: [CommonModule, HeaderComponent, RouterLink, AddSessionModalComponent]
})
export class SessionsComponent implements OnInit {
    sessions: ISession[] = []
    sessionsSub$!: Subscription;

    constructor(
        private titleService: Title,
        private sessionService: SessionService
    ) {
        this.titleService.setTitle("Sessions - Babcock University School of Law and Security Studies");
    }

    ngOnInit(): void {
        this.sessionsSub$ = this.sessionService.getSessions().subscribe({
            next: (sessions) => {
                console.log(sessions);
                this.sessions = sessions;
            },
            error: (error) => {
                console.error(error);
            },
            complete: () => {
                this.sessionsSub$.unsubscribe();
            }
        })
    }
}

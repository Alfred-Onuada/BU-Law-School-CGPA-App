import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../header/header.component";
import { ISession } from '../interfaces/session';
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser'
import { AddSessionModalComponent } from "../add-session-modal/add-session-modal.component";
import { SessionService } from '../services/session.service';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
    selector: 'app-sessions',
    standalone: true,
    templateUrl: './sessions.component.html',
    styleUrls: ['./sessions.component.css'],
    imports: [CommonModule, HeaderComponent, RouterLink, MatDialogModule]
})
export class SessionsComponent {
    sessions: ISession[] = []
    sessionsSub$!: Subscription;

    loading = true;
    showError = false;
    errorMessage = "";

    constructor(
        private titleService: Title,
        private sessionService: SessionService,
        public dialog: MatDialog
    ) {
        this.titleService.setTitle("Sessions - Babcock University School of Law and Security Studies");

        this.sessionsSub$ = this.sessionService.getSessions().subscribe({
            next: data => {
                this.sessions = data;

                this.loading = false;
            },
            error: (error) => {
                console.error(error);

                this.showError = true;
                this.errorMessage = "An error occurred while fetching sessions. Please try again later.";

                setTimeout(() => {
                    this.showError = false;
                    this.errorMessage = "";

                    this.loading = false;
                }, 3000);
            },
            complete: () => {
                this.sessionsSub$.unsubscribe();
            }
        })
    }

    openSessionModal() {
        this.dialog.open(AddSessionModalComponent);
    }
}

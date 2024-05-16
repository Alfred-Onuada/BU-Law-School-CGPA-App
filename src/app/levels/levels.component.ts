import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../header/header.component";
import { Router, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ILevel } from '../interfaces/level';
import { AddLevelModalComponent } from "../add-level-modal/add-level-modal.component";
import { Subscription } from 'rxjs';
import { LevelService } from '../services/level.service';
import { ISemester } from '../interfaces/semester';
import { ISession } from '../interfaces/session';

@Component({
    selector: 'app-levels',
    standalone: true,
    templateUrl: './levels.component.html',
    styleUrls: ['./levels.component.css'],
    imports: [CommonModule, HeaderComponent, RouterLink, AddLevelModalComponent]
})
export class LevelsComponent implements OnInit {
    levels: ILevel[] = [];
    levelsSub$!: Subscription;
    loading = true;
    showError = false;
    errorMessage = '';
    semesterId = '';

    semesterAndSessionDetailsSub$!: Subscription;
    session!: ISession;
    semester!: ISemester;

    constructor(
        private titleService: Title,
        private router: Router,
        private levelService: LevelService
    ) {
        this.titleService.setTitle("Levels - Babcock University School of Law and Security Studies");
    }

    ngOnInit(): void {
        this.semesterId = this.router.parseUrl(this.router.url).queryParams['semesterId'];
        
        this.semesterAndSessionDetailsSub$ = this.levelService.getSemesterAndSessionDetails(this.semesterId).subscribe({
            next: ({semester, session}) => {
                this.semester = semester;
                this.session = session;
            },
            error: (error) => {
                console.error(error);

                this.showError = true;
                this.errorMessage = error.message;
                
                setTimeout(() => {
                    this.showError = false;
                    this.errorMessage = '';
                    this.loading = false;
                }, 5000);
            },
            complete: () => {
                this.semesterAndSessionDetailsSub$.unsubscribe();
            }
        });

        this.levelsSub$ = this.levelService.getLevels().subscribe({
            next: (levels) => {
                this.levels = levels;
                this.loading = false;
            },
            error: (error) => {
                console.error(error);

                this.showError = true;
                this.errorMessage = error.message;
                
                setTimeout(() => {
                    this.showError = false;
                    this.errorMessage = '';
                    this.loading = false;
                }, 5000);
            },
            complete: () => {
                this.levelsSub$.unsubscribe();
            }
        });
    }
}

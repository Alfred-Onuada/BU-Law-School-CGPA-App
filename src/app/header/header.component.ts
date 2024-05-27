import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EditCoursesModalComponent } from "../edit-courses-modal/edit-courses-modal.component";
import { AddStudentsModalComponent } from "../add-students-modal/add-students-modal.component";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
    selector: 'app-header',
    standalone: true,
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
    imports: [CommonModule, RouterLink, MatDialogModule, RouterLink]
})
export class HeaderComponent {
    constructor(
        public dialog: MatDialog
    ) {}

    openEditCoursesModal() {
        this.dialog.open(EditCoursesModalComponent);
    }

    openAddStudentsModal() {
        this.dialog.open(AddStudentsModalComponent);
    }
}

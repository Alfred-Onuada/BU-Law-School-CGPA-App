import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EditCoursesModalComponent } from "../edit-courses-modal/edit-courses-modal.component";

@Component({
    selector: 'app-header',
    standalone: true,
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
    imports: [CommonModule, RouterLink, EditCoursesModalComponent]
})
export class HeaderComponent {

}

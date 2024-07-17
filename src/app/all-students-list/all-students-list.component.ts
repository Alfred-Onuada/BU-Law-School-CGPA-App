import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FormsModule } from '@angular/forms';
import { IAllStudentsList } from '../interfaces/all-students-list';
import { Subscription } from 'rxjs';
import { StudentService } from '../services/student.service';

@Component({
  selector: 'app-all-students-list',
  standalone: true,
  templateUrl: './all-students-list.component.html',
  styleUrls: ['./all-students-list.component.css'],
  imports: [CommonModule, HeaderComponent, FormsModule],
})
export class AllStudentsListComponent {
  showError = false;
  errorMessage = '';
  studentLoading = true;
  paginationLoading = false;
  searchLoading = false;
  exportResultsLoading = false;
  exportAllStudentsLoading = false;

  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;

  // this will change to a new structure to support the idea
  students: IAllStudentsList[] = [];
  studentsSub$!: Subscription;

  private query: string = '';

  constructor(private studentService: StudentService) {
    this.studentsSub$ = this.studentService
      .getAllStudents(this.pageSize)
      .subscribe({
        next: (result) => {
          this.students = result.students;
          this.totalPages = Math.ceil(result.total / this.pageSize);

          this.studentLoading = false;
        },
        error: (error) => {
          console.error(error);

          this.showError = true;
          this.errorMessage = error.error.message;

          setTimeout(() => {
            this.showError = false;
            this.errorMessage = '';
            this.studentLoading = false;
          }, 3000);
        },
        complete: () => {
          this.studentsSub$.unsubscribe();
        },
      });
  }

  get searchTerm(): string {
    return this.query;
  }

  set searchTerm(value: string) {
    this.query = value;

    if (this.query.trim().length === 0) {
      this.resetSearch();
    }

    if (this.query.trim().length >= 2) {
      this.searchStudents();
    }
  }

  searchStudents() {
    this.searchLoading = true;

    this.studentsSub$ = this.studentService
      .getAllStudents(this.pageSize, 0, this.query)
      .subscribe({
        next: (result) => {
          this.students = result.students;
          this.totalPages = Math.ceil(result.total / this.pageSize);
          this.currentPage = 1;

          this.searchLoading = false;
        },
        error: (error) => {
          console.error(error);

          this.showError = true;
          this.errorMessage = error.error.message;

          this.searchLoading = false;

          setTimeout(() => {
            this.showError = false;
            this.errorMessage = '';
          }, 3000);
        },
        complete: () => {
          this.studentsSub$.unsubscribe();
        },
      });
  }

  resetSearch() {
    this.query = '';
    this.searchLoading = true;

    this.studentsSub$ = this.studentService
      .getAllStudents(this.pageSize, 0, this.query)
      .subscribe({
        next: (result) => {
          this.students = result.students;
          this.totalPages = Math.ceil(result.total / this.pageSize);
          this.currentPage = 1;

          this.searchLoading = false;
        },
        error: (error) => {
          console.error(error);

          this.showError = true;
          this.errorMessage = error.error.message;

          this.searchLoading = false;

          setTimeout(() => {
            this.showError = false;
            this.errorMessage = '';
          }, 3000);
        },
        complete: () => {
          this.studentsSub$.unsubscribe();
        },
      });
  }

  prevPage() {
    if (this.currentPage <= 1) {
      return;
    }

    this.paginationLoading = true;
    this.currentPage--;

    this.studentsSub$ = this.studentService
      .getAllStudents(this.pageSize, this.currentPage, this.query)
      .subscribe({
        next: (result) => {
          this.students = result.students;
          this.totalPages = Math.ceil(result.total / this.pageSize);

          this.paginationLoading = false;
        },
        error: (error) => {
          console.error(error);

          this.showError = true;
          this.errorMessage = error.error.message;

          this.paginationLoading = false;

          setTimeout(() => {
            this.showError = false;
            this.errorMessage = '';
          }, 3000);
        },
        complete: () => {
          this.studentsSub$.unsubscribe();
        },
      });
  }

  nextPage() {
    if (this.currentPage >= this.totalPages) {
      return;
    }

    this.currentPage++;
    this.paginationLoading = true;

    this.studentsSub$ = this.studentService
      .getAllStudents(this.pageSize, this.currentPage, this.query)
      .subscribe({
        next: (result) => {
          this.students = result.students;
          this.totalPages = Math.ceil(result.total / this.pageSize);

          this.paginationLoading = false;
        },
        error: (error) => {
          console.error(error);

          this.showError = true;
          this.errorMessage = error.error.message;

          this.paginationLoading = false;

          setTimeout(() => {
            this.showError = false;
            this.errorMessage = '';
          }, 3000);
        },
        complete: () => {
          this.studentsSub$.unsubscribe();
        },
      });
  }

  exportAllStudents() {
    this.exportAllStudentsLoading = true;

    this.studentsSub$ = this.studentService.getAllStudents(-1, 0, this.query).subscribe({
        next: (result) => {
          const csv = this.convertToCSV(result.students);
          const blob = this.createBlob(csv);
          this.downloadCSV(blob, `BU Law School all students.csv`);
  
          this.exportAllStudentsLoading = false;
        },
        error: (error) => {
          console.error(error);
  
          this.showError = true;
          this.errorMessage = error.error.message;
  
          this.exportAllStudentsLoading = false;
  
          setTimeout(() => {
            this.showError = false;
            this.errorMessage = '';
          }, 3000);
        },
        complete: () => {
          this.studentsSub$.unsubscribe();
        }
      });
  }

  exportResults() {
    this.exportResultsLoading = true;

    this.studentsSub$ = this.studentService.getAllStudents(this.pageSize, this.currentPage, this.query).subscribe({
        next: (result) => {
          const csv = this.convertToCSV(result.students);
          const blob = this.createBlob(csv);
          this.downloadCSV(blob, `(${this.query}) - Bu Law school students.csv`);
  
          this.exportResultsLoading = false;
        },
        error: (error) => {
          console.error(error);
  
          this.showError = true;
          this.errorMessage = error.error.message;
  
          this.exportResultsLoading = false;
  
          setTimeout(() => {
            this.showError = false;
            this.errorMessage = '';
          }, 3000);
        },
        complete: () => {
          this.studentsSub$.unsubscribe();
        }
      });
  }

  convertToCSV(array: any[]): string {
    let header = Object.keys(array[0]).join(',');
    const rows = array.map((obj) => {
      // check if it has more columns
      if (Object.keys(obj).length > header.split(',').length) {
        const missingColumns = Object.keys(obj)
          .filter((key) => !header.includes(key))
          .join(',');

        header += `,${missingColumns}`;
      }

      return Object.values(obj)
        .map((value) =>
          typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
        )
        .join(',')
    });
    return [header, ...rows].join('\r\n');
  }

  createBlob(csv: string): Blob {
    return new Blob([csv], { type: 'text/csv' });
  }

  downloadCSV(blob: Blob, filename: string) {
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
